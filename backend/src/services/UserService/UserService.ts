import * as argon2 from 'argon2';

import { UserRole } from '@backend/dtos/RoleDTO';
import { AppError } from '@backend/errors/AppError';
import { createToken } from '@backend/libs/jwt';
import { UserRepository } from '@backend/repositories/UserRepository';
import { JWTPayload } from '@backend/types/types';

export class UserService {
  private readonly authUser: JWTPayload | null;
  private readonly userRepository: UserRepository;

  constructor(authUser: JWTPayload | null, userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.authUser = authUser;
  }

  async getUserById(id: number) {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async getUserRole(userId: number) {
    return this.userRepository.getUserRole(userId);
  }

  async getRoleByName(roleName: string) {
    return this.userRepository.getRoleByName(roleName);
  }

  async hasUserAdminRole(userId: number) {
    const userRole = await this.userRepository.getUserRole(userId);
    return userRole?.name === UserRole.ADMIN;
  }

  async hasUserNotaryRole(userId: number) {
    const userRole = await this.userRepository.getUserRole(userId);
    return userRole?.name === UserRole.NOTARY;
  }

  async findAllUsers() {
    return this.userRepository.findUsers();
  }

  async updateUserInfo(
    userId: number,
    data: {
      beforeTitle: string;
      firstname: string;
      lastname: string;
      afterTitle: string;
    },
  ) {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }

    if (this.authUser!.id !== user.id) {
      throw new AppError('UNAUTHORIZED', 'Unauthorized');
    }

    await this.userRepository.updateUser({
      ...user,
      beforeTitle: data.beforeTitle,
      firstname: data.firstname,
      lastname: data.lastname,
      afterTitle: data.afterTitle,
    });

    return await this.userRepository.getUserById(userId);
  }

  async updateUserPreferences(userId: number, emailNotifications: boolean) {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }

    if (this.authUser!.id !== user.id) {
      throw new AppError('UNAUTHORIZED', 'Unauthorized');
    }

    await this.userRepository.updateUser({
      ...user,
      emailNotifications,
    });

    return await this.userRepository.getUserById(userId);
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.userRepository.getUserById(userId);

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }

    const role = await this.getUserRole(userId);
    if (!role) {
      throw new AppError('NOT_FOUND', 'Role not found');
    }

    if (await argon2.verify(user.password, oldPassword)) {
      await this.updateUserPassword(user.id, newPassword);

      return {
        user,
        role,
        token: createToken({ id: user.id }),
      };
    }
    throw new AppError('UNAUTHORIZED', 'Unauthorized');
  }

  async updateUserPassword(userId: number, newPassword: string) {
    const password = await argon2.hash(newPassword);

    await this.userRepository.updateUserPassword(userId, password);
  }

  async createUser(userData: {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    roleId: number;
    criteriaId: number | null;
  }) {
    return this.userRepository.createUser(userData);
  }

  async createVerificationToken(tokenData: {
    userId: number;
    verificationToken: string;
    tokenExpiration: Date;
    reason: string;
  }) {
    return await this.userRepository.createVerificationToken({
      userId: tokenData.userId,
      token: tokenData.verificationToken,
      expiresAt: tokenData.tokenExpiration,
      reason: tokenData.reason,
    });
  }

  async getVerificationTokenByUserIdAndReason(userId: number, reason: string) {
    return await this.userRepository.getVerificationTokenByUserIdAndReason(
      userId,
      reason,
    );
  }

  async getVerificationToken(token: string, reason: string) {
    return await this.userRepository.getVerificationTokenByTokenAndReason(
      token,
      reason,
    );
  }

  async deleteVerificationToken(tokenId: number) {
    await this.userRepository.deleteVerificationToken(tokenId);
  }

  async markUserAsVerified(userId: number, isVerified: boolean) {
    const user = await this.getUserById(userId);

    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found');
    }

    await this.userRepository.updateUser({
      ...user,
      isVerified,
    });
  }
}
