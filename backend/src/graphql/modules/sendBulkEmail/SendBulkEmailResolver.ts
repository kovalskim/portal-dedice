import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { Proceeding } from '@backend/graphql/modules/proceedings/proceedingType';
import { SendEmailRequest } from '@backend/graphql/modules/sendBulkEmail/sendBulkEmailType';
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
