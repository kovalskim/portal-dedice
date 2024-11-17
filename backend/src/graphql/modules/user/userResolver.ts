import * as argon2 from 'argon2';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import {
  existingError,
  notFoundError,
  unauthenticatedError,
  unauthorizedError,
  validationError,
  verificationError,
} from '@backend/graphql/errors';
import { createToken, parseAndVerifyJWT } from '@backend/libs/jwt';
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from '@backend/services/emailService/emailService';
import { type CustomContext } from '@backend/types/types';

import { Role, UserRole } from './roleType';
import { signUpSchema } from './userSchema';
import { AuthInfo, SignInInfo, User } from './userType';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(
    @Arg('id') stringId: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<User | null> {
    const id = parseInt(stringId);
    const user = await usersRepository.getUserById(id);
    return user ?? null;
  }

  @FieldResolver(() => Role)
  role(
    @Root() user: User,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<Role | null> {
    return usersRepository.getUserRole(user.id);
  }

  @Query(() => [User])
  async users(@Ctx() { usersRepository }: CustomContext): Promise<User[]> {
    return usersRepository.findUsers();
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('userId') stringId: string,
    @Arg('beforeTitle', { nullable: true }) beforeTitle: string,
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string,
    @Arg('afterTitle', { nullable: true }) afterTitle: string,
    @Ctx() { authUser, usersRepository }: CustomContext,
  ): Promise<User> {
    if (!authUser) {
      throw unauthenticatedError('Unauthenticated');
    }

    const userId = parseInt(stringId);
    const user = await usersRepository.getUserById(userId);

    if (!user) {
      throw notFoundError('User not found');
    }

    if (authUser.id !== user.id) {
      throw unauthorizedError('Unauthorized');
    }

    await usersRepository.updateUser({
      ...user,
      beforeTitle,
      firstname,
      lastname,
      afterTitle,
    });

    return await usersRepository.getUserById(userId);
  }

  @Mutation(() => User)
  async updateUserPreferences(
    @Arg('userId') stringId: string,
    @Arg('emailNotifications') emailNotifications: boolean,
    @Ctx() { authUser, usersRepository }: CustomContext,
  ): Promise<User> {
    if (!authUser) {
      throw unauthenticatedError('Unauthenticated');
    }

    const userId = parseInt(stringId);
    const user = await usersRepository.getUserById(userId);

    if (!user) {
      throw notFoundError('User not found');
    }

    if (authUser.id !== user.id) {
      throw unauthorizedError('Unauthorized');
    }

    await usersRepository.updateUser({
      ...user,
      emailNotifications,
    });

    return await usersRepository.getUserById(userId);
  }

  @Mutation(() => AuthInfo)
  async changePassword(
    @Arg('userId') stringId: string,
    @Arg('oldPassword') oldPassword: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<AuthInfo> {
    const userId = parseInt(stringId, 10);
    const user = await usersRepository.getUserById(userId);

    if (!user) {
      throw unauthorizedError('Unauthorized');
    }

    if (await argon2.verify(user.password, oldPassword)) {
      const password = await argon2.hash(newPassword);

      await usersRepository.updateUserPassword(user.id, password);

      return {
        user,
        token: createToken({ id: user.id }),
      };
    } else {
      throw unauthorizedError('Unauthorized.');
    }
  }

  @Mutation(() => SignInInfo)
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<SignInInfo> {
    const user = await usersRepository.getUserByEmail(email);

    if (!user) {
      throw unauthorizedError('Unauthorized');
    }

    if (!user.isVerified) {
      throw verificationError('Email not verified');
    }

    if (await argon2.verify(user.password, password)) {
      const token = createToken({ id: user.id });

      const role = await usersRepository.getUserRole(user.id);
      if (!role) {
        throw unauthorizedError('Unauthorized');
      }

      return {
        user,
        role,
        token,
      };
    } else {
      throw unauthorizedError('Unauthorized');
    }
  }

  @Mutation(() => AuthInfo)
  async signUp(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<AuthInfo> {
    /* VALIDATION */
    try {
      signUpSchema.parse({ email, password, firstname, lastname });
    } catch {
      throw validationError('Invalid input');
    }

    const existingUser = await usersRepository.getUserByEmail(email);

    if (existingUser) {
      throw existingError('Email already registered');
    }

    /* PASSWORD HASHING */
    const passwordHash = await argon2.hash(password);

    const role = await usersRepository.getRoleByName(UserRole.USER);

    if (!role) {
      throw notFoundError('Role not found');
    }

    /* INSERT USER */
    const userId = await usersRepository.createUser({
      email,
      password: passwordHash,
      firstname,
      lastname,
      roleId: role.id,
    });

    /* GENERATE TOKEN */
    const verificationToken = createToken({
      email,
      userId,
    });

    //TODO - check if backend server is on the same timezone as database server
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 3); // Token expires in 3 hours

    /* INSERT VERIFICATION TOKEN */
    await usersRepository.createVerificationToken({
      userId: userId,
      token: verificationToken,
      expiresAt: tokenExpiration,
      reason: 'register',
    });

    /* SEND EMAIL */
    sendVerificationEmail(email, verificationToken);

    /* ASSEMBLE MUTATION RESPONSE */
    const token = createToken({ id: userId });

    const userObject = {
      id: userId,
      email,
      beforeTitle: null,
      firstname,
      lastname,
      afterTitle: null,
      isVerified: false,
      emailNotifications: true,
    };

    return { user: userObject, token: token };
  }

  @Mutation(() => String)
  async verifyEmail(
    @Arg('token') token: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<string> {
    const decoded = parseAndVerifyJWT(token);

    if (!decoded || !decoded.email || !decoded.userId) {
      throw validationError('Invalid or expired verification token');
    }

    const tokenRecord =
      await usersRepository.getVerificationTokenByUserIdAndReason(
        decoded.userId,
        'register',
      );

    if (!tokenRecord || !tokenRecord.expiresAt) {
      throw validationError('Invalid or expired verification token');
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      throw validationError('Verification token has expired');
    }

    const userRecord = await usersRepository.getUserById(decoded.userId);

    if (!userRecord) {
      throw notFoundError('User not found');
    }

    await usersRepository.updateUser({ ...userRecord, isVerified: true });

    return 'Email successfully verified!';
  }

  @Mutation(() => String)
  async restorePassword(
    @Arg('email') email: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<string> {
    const user = await usersRepository.getUserByEmail(email);

    //everytime return success
    if (user) {
      const userId = user.id;

      const verificationToken = createToken({ email, userId });
      const tokenExpiration = new Date();
      tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Token expires in 1 hour

      await usersRepository.createVerificationToken({
        userId: userId,
        token: verificationToken,
        expiresAt: tokenExpiration,
        reason: 'password_reset',
      });

      sendPasswordResetEmail(email, verificationToken);
    }

    return 'E-mail successfully sent';
  }

  @Mutation(() => String)
  async newPassword(
    @Arg('newPassword') newPassword: string,
    @Arg('token') token: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<string> {
    //check token exits and validity
    const tokenRecord =
      await usersRepository.getVerificationTokenByTokenAndReason(
        token,
        'password_reset',
      );

    if (!tokenRecord || !tokenRecord.expiresAt) {
      throw validationError('Invalid or expired verification token');
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      throw validationError('Verification token has expired');
    }

    //find user id
    const user = await usersRepository.getUserById(tokenRecord.userId);

    if (!user) {
      throw unauthorizedError('Unauthorized');
    }

    //set new password
    const password = await argon2.hash(newPassword);

    await usersRepository.updateUserPassword(user.id, password);

    await usersRepository.deleteVerificationToken(tokenRecord.id);

    return 'Password successfully changed';
  }

  @Mutation(() => String)
  async verifyToken(
    @Arg('token') token: string,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<string> {
    const decoded = parseAndVerifyJWT(token);

    if (!decoded || !decoded.email || !decoded.userId) {
      throw validationError('Invalid or expired verification token');
    }

    const tokenRecord =
      await usersRepository.getVerificationTokenByUserIdAndReason(
        decoded.userId,
        'password_reset',
      );

    if (!tokenRecord || !tokenRecord.expiresAt) {
      throw validationError('Invalid or expired verification token');
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      throw validationError('Verification token has expired');
    }

    return 'Token successfully verified';
  }
}
