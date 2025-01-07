import * as argon2 from 'argon2';

import { UserRole } from '@backend/dtos/RoleDTO';
import { UserInvitationDTO } from '@backend/dtos/UserInvitationDTO';
import { AppError } from '@backend/errors/AppError';
import { signUpSchema } from '@backend/graphql/modules/user/userSchema';
import { createToken, parseAndVerifyJWT } from '@backend/libs/jwt';
import { UserInvitationRepository } from '@backend/repositories/UserInvitationRepository';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { UserService } from '@backend/services/UserService/UserService';

export class AuthenticationService {
  private readonly userService: UserService;
  private readonly emailService: EmailService;
  private readonly userInvitationRepository: UserInvitationRepository;

  constructor(
    userService: UserService,
    emailService: EmailService,
    userInvitationRepository: UserInvitationRepository,
  ) {
    this.userService = userService;
    this.emailService = emailService;
    this.userInvitationRepository = userInvitationRepository;
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new AppError('UNAUTHORIZED', 'Unauthorized');
    }

    if (!user.isVerified) {
      throw new AppError('VERIFICATION_ERROR', 'Email not verified');
    }

    const passwordVerified = await argon2.verify(user.password, password);

    if (!passwordVerified) throw new AppError('UNAUTHORIZED', 'Unauthorized');

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

  async signUp(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    token: string,
  ) {
    const invitationRecord = await this.verifyInvitation(
      token,
      email,
      firstname,
      lastname,
    );

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

    const roleName = await this.determineRole(invitationRecord);
    const role = await this.userService.getRoleByName(roleName);
    if (!role) {
      throw new AppError('NOT_FOUND', 'Role not found');
    }

    /* INSERT USER */
    const passwordHash = await argon2.hash(password);
    const userId = await this.userService.createUser({
      email,
      password: passwordHash,
      firstname,
      lastname,
      roleId: role.id,
      criteriaId: invitationRecord?.criteriaId ?? null,
    });

    /* GENERATE AND INSERT VERIFICATION TOKEN */
    const { verificationToken, tokenExpiration } =
      this.generateVerificationToken(userId, email);
    await this.userService.createVerificationToken({
      userId,
      verificationToken,
      tokenExpiration,
      reason: 'register',
    });

    /* SEND EMAIL */
    await this.emailService.sendVerificationEmail(email, verificationToken);

    /* ASSEMBLE MUTATION RESPONSE */
    const signInToken = createToken({ id: userId });

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

    if (invitationRecord) {
      await this.userInvitationRepository.deleteInvitationToken(
        invitationRecord.id,
      );
    }

    return { user: userObject, role: role, token: signInToken };
  }

  async verifyEmail(token: string) {
    const result = await this.verifyToken(token, 'register');

    if (!result.decoded.userId) {
      throw new AppError(
        'INVALID_TOKEN',
        'Token payload does not contain userId.',
      );
    }

    await this.userService.markUserAsVerified(result.decoded.userId, true);

    await this.userService.deleteVerificationToken(result.tokenRecord.id);

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

    await this.emailService.sendPasswordResetEmail(email, verificationToken);

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
    return { tokenRecord, decoded };
  }

  private async verifyInvitation(
    token: string,
    email: string,
    firstname: string,
    lastname: string,
  ) {
    if (!token) return null;

    const invitationRecord =
      await this.userInvitationRepository.getInvitationByToken(token);
    if (!invitationRecord) {
      throw new AppError(
        'INVALID_TOKEN',
        'Token details do not match form values',
      );
    }

    if (
      token &&
      (invitationRecord.email !== email ||
        invitationRecord.firstname !== firstname ||
        invitationRecord.lastname !== lastname)
    ) {
      throw new AppError(
        'INVALID_TOKEN',
        'Token details do not match form values',
      );
    }

    return invitationRecord;
  }

  private async determineRole(invitationRecord: UserInvitationDTO | null) {
    if (!invitationRecord) {
      return UserRole.USER;
    } else {
      return invitationRecord.role;
    }
  }

  private generateVerificationToken(userId: number, email: string) {
    const verificationToken = createToken({
      email,
      userId,
    });

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 3); // Token expires in 3 hours

    return { verificationToken, tokenExpiration };
  }
}
