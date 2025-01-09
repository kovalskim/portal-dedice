import { BulkEmailDTO } from '@backend/dtos/BulkEmailDTO';
import { AppError } from '@backend/errors/AppError';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { ParticipantService } from '@backend/services/ParticipantService/ParticipantService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { ProceedingService } from '@backend/services/ProceedingService/ProceedingService';

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
