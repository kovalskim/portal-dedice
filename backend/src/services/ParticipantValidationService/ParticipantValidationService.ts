import { ProceedingsRepository } from '@backend/repository/ProceedingsRepository';

export class ParticipantValidationService {
  proceedingRepository: ProceedingsRepository;

  constructor(proceedingRepository: ProceedingsRepository) {
    this.proceedingRepository = proceedingRepository;
  }

  async isUserNotaryInProceeding(
    userId: number,
    proceedingId: number,
  ): Promise<boolean> {
    return await this.proceedingRepository.isUserNotaryInProceeding(
      userId,
      proceedingId,
    );
  }

  async isUserParticipantInProceeding(
    userId: number,
    proceedingId: number,
  ): Promise<boolean> {
    return await this.proceedingRepository.isUserParticipantInProceeding(
      userId,
      proceedingId,
    );
  }

  async isUserParticipantOrNotaryOfProceeding(
    userId: number,
    proceedingId: number,
  ): Promise<boolean> {
    const isParticipant = await this.isUserParticipantInProceeding(
      userId,
      proceedingId,
    );
    const isNotary = await this.isUserNotaryInProceeding(userId, proceedingId);
    return isParticipant || isNotary;
  }
}
