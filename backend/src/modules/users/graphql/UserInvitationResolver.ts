import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { UserInvitationInput } from '@backend/modules/users/graphql/types/UserInvitationInput';
import { User } from '@backend/modules/users/graphql/types/userType';
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
