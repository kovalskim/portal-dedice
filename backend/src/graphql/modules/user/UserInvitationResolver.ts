import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { UserInvitationInput } from '@backend/graphql/modules/user/UserInvitationInput';
import { User } from '@backend/graphql/modules/user/userType';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => User)
export class UserInvitationResolver {
  @Mutation(() => Boolean)
  @Authenticated()
  async inviteUser(
    @Arg('data') input: UserInvitationInput,
    @Ctx()
    { userInvitationService }: AuthenticatedContext,
  ) {
    return await userInvitationService.inviteUserToPortalApp(input);
  }
}
