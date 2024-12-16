import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Role } from '@backend/graphql/modules/user/roleType';
import { AuthInfo, User } from '@backend/graphql/modules/user/userType';
import { type CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  async user(
    @Arg('id') id: number,
    @Ctx() { userService }: CustomContext,
  ): Promise<User | null> {
    return userService.getUserById(id);
  }

  @FieldResolver(() => Role)
  role(
    @Root() user: User,
    @Ctx() { userService }: CustomContext,
  ): Promise<Role | null> {
    return userService.getUserRole(user.id);
  }

  @Query(() => [User])
  async users(@Ctx() { userService }: CustomContext): Promise<User[]> {
    return userService.findAllUsers();
  }

  @Mutation(() => User)
  @Authenticated()
  async updateUser(
    @Arg('userId') userId: string,
    @Arg('beforeTitle', { nullable: true }) beforeTitle: string,
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string,
    @Arg('afterTitle', { nullable: true }) afterTitle: string,
    @Ctx() { userService }: AuthenticatedContext,
  ): Promise<User> {
    return userService.updateUserInfo(parseInt(userId), {
      beforeTitle,
      firstname,
      lastname,
      afterTitle,
    });
  }

  @Mutation(() => User)
  @Authenticated()
  async updateUserPreferences(
    @Arg('userId') userId: string,
    @Arg('emailNotifications') emailNotifications: boolean,
    @Ctx() { userService }: AuthenticatedContext,
  ): Promise<User> {
    return userService.updateUserPreferences(
      parseInt(userId),
      emailNotifications,
    );
  }

  @Mutation(() => AuthInfo)
  async changePassword(
    @Arg('userId') userId: string,
    @Arg('oldPassword') oldPassword: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { userService }: CustomContext,
  ): Promise<AuthInfo> {
    return userService.changePassword(
      parseInt(userId),
      oldPassword,
      newPassword,
    );
  }

  @Mutation(() => AuthInfo)
  async signIn(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { authenticationService }: CustomContext,
  ): Promise<AuthInfo> {
    return authenticationService.signIn(email, password);
  }

  @Mutation(() => AuthInfo)
  async signUp(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('firstname') firstname: string,
    @Arg('lastname') lastname: string,
    @Ctx() { authenticationService }: CustomContext,
  ): Promise<AuthInfo> {
    return authenticationService.signUp(email, password, firstname, lastname);
  }

  @Mutation(() => String)
  async verifyEmail(
    @Arg('token') token: string,
    @Ctx() { authenticationService }: CustomContext,
  ): Promise<boolean> {
    return authenticationService.verifyEmail(token);
  }

  @Mutation(() => String)
  async restorePassword(
    @Arg('email') email: string,
    @Ctx() { authenticationService }: CustomContext,
  ): Promise<boolean> {
    return authenticationService.restorePassword(email);
  }

  @Mutation(() => String)
  async newPassword(
    @Arg('newPassword') newPassword: string,
    @Arg('token') token: string,
    @Ctx() { authenticationService }: CustomContext,
  ): Promise<boolean> {
    return authenticationService.setNewPassword(token, newPassword);
  }

  @Mutation(() => String)
  async verifyToken(
    @Arg('token') token: string,
    @Ctx() { authenticationService }: CustomContext,
  ): Promise<string> {
    return authenticationService.verifyResetPasswordToken(token);
  }
}
