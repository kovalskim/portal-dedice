import { AppError } from '@backend/errors/AppError';
import { BulkEmailDTO } from '@backend/modules/bulkEmail/dtos/BulkEmailDTO';
import { EmailService } from '@backend/modules/emails/EmailService';
import { ParticipantService } from '@backend/modules/participants/services/ParticipantService';
import { ParticipantValidationService } from '@backend/modules/participants/services/ParticipantValidationService';
import { ProceedingService } from '@backend/modules/proceedings/services/ProceedingService';

export class BulkEmailService {
  private readonly participantValidationService: ParticipantValidationService;
  private readonly proceedingService: ProceedingService;
  private readonly participantService: ParticipantService;
  private readonly emailService: EmailService;

  constructor(
    participantValidationService: ParticipantValidationService,
    proceedingService: ProceedingService,
    participantService: ParticipantService,
    emailService: EmailService,
  ) {
    this.participantValidationService = participantValidationService;
    this.proceedingService = proceedingService;
    this.participantService = participantService;
    this.emailService = emailService;
  }

  async sendBulkEmailToParticipants(notaryId: number, input: BulkEmailDTO) {
    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        notaryId,
        input.proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    const proceeding = await this.proceedingService.getProceeding(
      notaryId,
      input.proceedingId,
    );
    if (!proceeding) {
      throw new AppError('NOT_FOUND', 'Proceeding not found');
    }

    if (await this.proceedingService.isProceedingFinished(input.proceedingId)) {
      throw new AppError('PROCEEDING_FINISHED');
    }

    // validate that all receivers are in proceeding
    const participants =
      await this.participantService.findParticipantsInProceeding(
        notaryId,
        input.proceedingId,
      );

    if (
      !input.receivers.every(
        (receiver) =>
          participants.find((val) => val.user.email === receiver) !== undefined,
      )
    ) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Not all receivers are proceeding participants.',
      );
    }

    await this.emailService.sendBulkEmail(
      input.title,
      input.message,
      proceeding.id,
      proceeding.proceedingNumber,
      input.receivers,
    );

    return true;
  }
}
