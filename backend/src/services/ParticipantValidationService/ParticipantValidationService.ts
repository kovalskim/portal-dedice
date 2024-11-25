import { ProceedingsRepository } from '@backend/repository/ProceedingsRepository';

export class ParticipantValidationService {
  proceedingRepository: ProceedingsRepository;

  constructor(proceedingRepository: ProceedingsRepository) {
    this.proceedingRepository = proceedingRepository;
  }

  async isUserParticipantOrNotaryOfProceeding(
    userId: number,
    proceedingId: number,
  ): Promise<boolean> {
    const isParticipant =
      await this.proceedingRepository.isUserParticipantInProceeding(
        userId,
        proceedingId,
      );
    const isNotary = await this.proceedingRepository.isUserNotaryInProceeding(
      userId,
      proceedingId,
    );
    return isParticipant || isNotary;
  }
}
