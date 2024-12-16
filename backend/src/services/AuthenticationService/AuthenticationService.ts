import * as argon2 from 'argon2';

import { UserRole } from '@backend/dtos/RoleDTO';
import { AppError } from '@backend/errors/AppError';
import { signUpSchema } from '@backend/graphql/modules/user/userSchema';
import { createToken, parseAndVerifyJWT } from '@backend/libs/jwt';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { UserService } from '@backend/services/UserService/UserService';

export class AuthenticationService {
  private readonly userService: UserService;
  private readonly emailService: EmailService;

  constructor(userService: UserService, emailService: EmailService) {
    this.userService = userService;
    this.emailService = emailService;
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new AppError('UNAUTHORIZED', 'Unauthorized');
    }

    if (!user.isVerified) {
      throw new AppError('VERIFICATION_ERROR', 'Email not verified');
    }

    if (await argon2.verify(user.password, password)) {
      const token = createToken({ id: user.id });

      const role = await this.userService.getUserRole(user.id);
      if (!role) {
        throw new AppError('NOT_FOUND', 'Role not found');
      }

      return {
        user,
        role,
        token,
      };
    }
    throw new AppError('UNAUTHORIZED', 'Unauthorized');
  }

  async signUp(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
  ) {
    /* VALIDATION */
    try {
      signUpSchema.parse({ email, password, firstname, lastname });
    } catch {
      throw new AppError('VALIDATION_ERROR');
    }

    const existingUser = await this.userService.getUserByEmail(email);

    if (existingUser) {
      throw new AppError('ALREADY_EXISTING', 'Email already registered');
    }

    /* PASSWORD HASHING */
    const passwordHash = await argon2.hash(password);

    const role = await this.userService.getRoleByName(UserRole.USER);

    if (!role) {
      throw new AppError('NOT_FOUND', 'Role not found');
    }

    /* INSERT USER */
    const userId = await this.userService.createUser({
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

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 3); // Token expires in 3 hours

    /* INSERT VERIFICATION TOKEN */
    await this.userService.createVerificationToken({
      userId,
      verificationToken,
      tokenExpiration,
      reason: 'register',
    });

    /* SEND EMAIL */
    await this.emailService.sendVerificationEmail(email, verificationToken);

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

    return { user: userObject, role: role, token: token };
  }

  async verifyEmail(token: string) {
    const decoded = await this.verifyToken(token, 'register');

    await this.userService.markUserAsVerified(decoded.userId, true);

    return true;
  }

  async restorePassword(email: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }

    const verificationToken = createToken({ email, userId: user.id });
    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1); // Token expires in 1 hour

    await this.userService.createVerificationToken({
      userId: user.id,
      verificationToken,
      tokenExpiration,
      reason: 'password_reset',
    });

    this.emailService.sendPasswordResetEmail(email, verificationToken);

    return true;
  }

  async setNewPassword(token: string, newPassword: string) {
    //check token exits and validity
    const tokenRecord = await this.userService.getVerificationToken(
      token,
      'password_reset',
    );

    if (!tokenRecord || !tokenRecord.userId || !tokenRecord.expiresAt) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Invalid or expired verification token',
      );
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      throw new AppError('VALIDATION_ERROR', 'Validation token has expired.');
    }

    //find user id
    const user = await this.userService.getUserById(tokenRecord.userId);

    if (!user) {
      throw new AppError('UNAUTHORIZED', 'Unauthorized');
    }

    await this.userService.updateUserPassword(user.id, newPassword);

    await this.userService.deleteVerificationToken(tokenRecord.id);

    return true;
  }

  async verifyResetPasswordToken(token: string) {
    await this.verifyToken(token, 'password_reset');
    return 'Token successfully verified';
  }

  private async verifyToken(token: string, reason: string) {
    const decoded = parseAndVerifyJWT(token);

    if (!decoded || !decoded.email || !decoded.userId) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Invalid or expired verification token',
      );
    }

    const tokenRecord =
      await this.userService.getVerificationTokenByUserIdAndReason(
        decoded.userId,
        reason,
      );

    if (!tokenRecord || !tokenRecord.expiresAt) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Invalid or expired verification token',
      );
    }

    if (new Date() > new Date(tokenRecord.expiresAt)) {
      throw new AppError('VALIDATION_ERROR', 'Validation token has expired.');
    }
    return decoded;
  }
}
