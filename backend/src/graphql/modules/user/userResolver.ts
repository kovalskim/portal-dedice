import * as argon2 from 'argon2';
import { and, eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql/error';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { roles, users, verificationTokens } from '@backend/db/schema';
import { createToken, parseAndVerifyJWT } from '@backend/libs/jwt';
import { sendVerificationEmail } from '@backend/services/userService/emailService';
import { type CustomContext } from '@backend/types/types';

import { signUpSchema } from './userSchema';
import { AuthInfo, User } from './userType';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(
    @Arg('id') stringId: string,
    @Ctx() { db }: CustomContext,
  ): Promise<User | null> {
    const id = parseInt(stringId, 10);
    const userRecord = await db.select().from(users).where(eq(users.id, id));

    if (userRecord.length === 0) {
      return null;
    }

    return userRecord[0];
  }

  @Query(() => [User])
  async users(@Ctx() { db }: CustomContext): Promise<User[]> {
    return await db.select().from(users);
  }

  @Mutation(() => AuthInfo)
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { db }: CustomContext,
  ): Promise<AuthInfo> {
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userRecord.length === 0) {
      throw new GraphQLError('Unauthorized.');
    }

    const foundUser = userRecord[0];
    if (await argon2.verify(foundUser.password, password)) {
      const token = createToken({ id: foundUser.id });

      return {
        user: { ...foundUser },
        token,
      };
    } else {
      throw new GraphQLError('Unauthorized.');
    }
  }

  @Mutation(() => AuthInfo)
  async signUp(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string,
    @Ctx() { db }: CustomContext,
  ): Promise<AuthInfo> {
    /* VALIDATION */

    try {
      signUpSchema.parse({ email, password, firstname, lastname });
    } catch (e) {
      throw new GraphQLError('Validation error', {
        extensions: {
          code: 'BAD_USER_INPUT',
        },
      });
    }

    const userByEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userByEmail.length > 0) {
      throw new GraphQLError('Email already registered');
    }

    /** PASSWORD HASHING */

    const passwordHash = await argon2.hash(password);

    //TODO - import role name from enum
    const role = (
      await db.select().from(roles).where(eq(roles.name, 'user'))
    )[0];

    if (!role) {
      throw new Error('Role not found');
    }

    /* INSERT USER */

    console.log('inserting new user to database');
    const insertResult = await db
      .insert(users)
      .values({
        email,
        password: passwordHash,
        firstname,
        lastname,
        isVerified: false,
        roleId: role.id,
      })
      .$returningId();

    /* GENERATE TOKEN */

    const userId = insertResult[0].id;
    const verificationToken = createToken({
      email,
      userId,
    });

    //TODO - check if backend server is on the same timezone as database server
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 3); // Token expires in 3 hours

    /* INSERT VERIFICATION TOKEN */

    console.log('inserting verification token');
    await db.insert(verificationTokens).values({
      userId,
      token: verificationToken,
      expiresAt: tokenExpiration.toISOString(),
      reason: 'register', // TODO - import from enum
    });

    /* SEND EMAIL */

    console.log('sending email');
    sendVerificationEmail(email, verificationToken);

    /* ASSEMBLE MUTATION RESPONSE */

    const id = insertResult[0].id;

    const token = createToken({ id });

    const userObject = {
      id,
      email,
      beforeTitle: null,
      firstname,
      lastname,
      afterTitle: null,
      isVerified: false,
    };

    return { user: userObject, token: token };
  }

  @Mutation(() => String)
  async verifyEmail(
    @Arg('token') token: string,
    @Ctx() { db }: CustomContext,
  ): Promise<string> {
    const decoded = parseAndVerifyJWT(token);

    if (!decoded || !decoded.email || !decoded.userId) {
      throw new GraphQLError('Invalid or expired verification token');
    }

    const tokenRecord = (
      await db
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.userId, decoded.userId),
            eq(verificationTokens.reason, 'register'),
          ),
        )
    )[0];

    if (!tokenRecord || !tokenRecord.expiresAt) {
      throw new GraphQLError('Invalid or expired verification token');
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      throw new GraphQLError('Verification token has expired');
    }

    const userRecord = (
      await db.select().from(users).where(eq(users.id, tokenRecord.userId))
    )[0];

    if (!userRecord) {
      throw new GraphQLError('User not found');
    }

    console.log('updating user');
    await db
      .update(users)
      .set({ isVerified: true })
      .where(eq(users.id, userRecord.id));

    return 'Email successfully verified!';
  }
  catch(error: unknown) {
    console.error('Email verification error:', error);
    throw new GraphQLError('Invalid or expired token');
  }
}
