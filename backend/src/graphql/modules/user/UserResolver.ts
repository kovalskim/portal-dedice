import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { NotaryCriteriaType } from '@backend/graphql/modules/user/NotaryCriteriaType';
import { Payload } from '@backend/graphql/modules/user/payloadType';
import { Role } from '@backend/graphql/modules/user/roleType';
import { UsersArgs } from '@backend/graphql/modules/user/UsersArgs';
import {
  AuthInfo,
  PaginatedUsers,
  User,
} from '@backend/graphql/modules/user/userType';
import { parseAndVerifyJWT } from '@backend/libs/jwt';
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

  @Query(() => PaginatedUsers)
  @Authenticated()
  async users(
    @Ctx() { userService }: CustomContext,
    @Args() args: UsersArgs,
  ): Promise<PaginatedUsers> {
    return userService.findAllUsers(args);
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
    @Arg('token') token: string, // TODO: nefunguje undefined
    @Ctx() { authenticationService }: CustomContext,
  ): Promise<AuthInfo> {
    return authenticationService.signUp(
      email,
      password,
      firstname,
      lastname,
      token,
    );
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

  @Mutation(() => Payload)
  async verifyToken(@Arg('token') token: string): Promise<Payload | null> {
    return parseAndVerifyJWT(token);
  }

  @Query(() => NotaryCriteriaType, { nullable: true })
  async notaryCriteria(
    @Arg('userId') userId: number,
    @Ctx() { notaryCriteriaService }: CustomContext,
  ) {
    return await notaryCriteriaService.getNotaryCriteria(userId);
  }

  @Mutation(() => Boolean)
  async setUserBanStatus(
    @Arg('userId') userId: number,
    @Arg('isBanned') isBanned: boolean,
    @Ctx() { userService }: CustomContext,
  ) {
    return await userService.setUserBanStatus(userId, isBanned);
  }
}
