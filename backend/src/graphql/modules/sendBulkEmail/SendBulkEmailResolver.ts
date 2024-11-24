import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import {
  forbiddenError,
  notFoundError,
  unauthorizedError,
} from '@backend/graphql/errors';
import { Proceedings } from '@backend/graphql/modules/proceedings/create/proceedingsType';
import { SendEmailRequest } from '@backend/graphql/modules/sendBulkEmail/sendBulkEmailType';
import { sendEmailToParticipant } from '@backend/services/emailService/emailService';
import { CustomContext } from '@backend/types/types';

@Resolver(() => Proceedings)
export class SendBulkEmailResolver {
  @Mutation(() => String)
  async sendMessageToParticipants(
    @Arg('data') input: SendEmailRequest,
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<string> {
    if (!authUser) {
      throw unauthorizedError('Unauthorized');
    }

    const proceedings = await proceedingsRepository.getProceedingsById(
      input.proceedingsId,
    );
    if (!proceedings) {
      throw notFoundError('Proceedings not found');
    }

    // validate that user is in proceeding and has correct rights
    if (proceedings.notaryId !== authUser.id) {
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
        proceedings.id,
        receiver,
      );
    });

    return 'E-mails successfully sent';
  }
}
