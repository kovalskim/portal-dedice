import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { forbiddenError, notFoundError } from '@backend/graphql/errors';
import { Proceeding } from '@backend/graphql/modules/proceedings/create/proceedingType';
import { sendEmailToParticipant } from '@backend/services/emailService/emailService';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

import { SendEmailRequest } from './sendBulkEmailType';

@Resolver(() => Proceeding)
export class SendBulkEmailResolver {
  @Mutation(() => String)
  @Authenticated()
  async sendMessageToParticipants(
    @Arg('data') input: SendEmailRequest,
    @Ctx() { authUser, proceedingsRepository }: AuthenticatedContext,
  ): Promise<string> {
    const proceeding = await proceedingsRepository.getProceedingById(
      input.proceedingsId,
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
      input.proceedingsId,
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
      sendEmailToParticipant(
        input.title,
        input.message,
        proceeding.id,
        receiver,
      );
    });

    return 'E-mails successfully sent';
  }
}
