import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { SendEmailRequest } from '@backend/modules/bulkEmail/graphql/types/sendBulkEmailType';
import { Proceeding } from '@backend/modules/proceedings/graphql/types/proceedingType';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => Proceeding)
export class SendBulkEmailResolver {
  @Mutation(() => String)
  @Authenticated()
  async sendMessageToParticipants(
    @Arg('data') input: SendEmailRequest,
    @Ctx()
    { authUser, bulkEmailService }: AuthenticatedContext,
  ): Promise<boolean> {
    return await bulkEmailService.sendBulkEmailToParticipants(
      authUser!.id,
      input,
    );
  }
}
