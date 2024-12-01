import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { forbiddenError, notFoundError } from '@backend/errors/graphqlErrors';
import { Proceeding } from '@backend/graphql/modules/proceedings/create/proceedingType';
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
    { authUser, proceedingsRepository, emailService }: AuthenticatedContext,
  ): Promise<string> {
    const proceeding = await proceedingsRepository.getProceedingById(
      input.proceedingId,
    );
    if (!proceeding) {
      throw notFoundError('Proceedings not found');
    }

    // validate that user is in proceeding and has correct rights
    if (proceeding.notaryId !== authUser.id) {
      throw forbiddenError('Forbidden');
    }

    // validate that all receivers are in proceeding
    const participants = await proceedingsRepository.getProceedingParticipants(
      input.proceedingId,
    );

    if (
      !input.receivers.every(
        (receiver) =>
          participants.find((val) => val.user.email === receiver) !== undefined,
      )
    ) {
      throw forbiddenError('Forbidden');
    }

    // send email to all receivers
    input.receivers.forEach((receiver) => {
      emailService.sendEmailToParticipant(
        input.title,
        input.message,
        proceeding.id,
        proceeding.proceedingNumber,
        receiver,
      );
    });

    return 'E-mails successfully sent';
  }
}
