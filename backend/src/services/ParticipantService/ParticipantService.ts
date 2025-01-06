import { ParticipantDTO } from '@backend/dtos/ParticipantDTO';
import { AppError } from '@backend/errors/AppError';
import { ParticipantsInput } from '@backend/graphql/modules/participants/ParticipantsInput';
import { createToken, parseAndVerifyJWT } from '@backend/libs/jwt';
import { ParticipantInvitationRepository } from '@backend/repositories/ParticipantInvitationRepository';
import { ParticipantRepository } from '@backend/repositories/ParticipantRepository';
import { UserRepository } from '@backend/repositories/UserRepository';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { JWTPayload } from '@backend/types/types';
import { PARTICIPANT_STATES } from '@backend/utils/constants';

export class ParticipantService {
  private readonly participantRepository: ParticipantRepository;
  private readonly participantInvitationRepository: ParticipantInvitationRepository;
  private readonly participantValidationService: ParticipantValidationService;
  private readonly userRepository: UserRepository;
  private readonly authUser: JWTPayload | null;
  private readonly emailService: EmailService;

  constructor(
    authUser: JWTPayload | null,
    participantRepository: ParticipantRepository,
    participantInvitationRepository: ParticipantInvitationRepository,
    participantValidationService: ParticipantValidationService,
    userRepository: UserRepository,
    emailService: EmailService,
  ) {
    this.authUser = authUser;
    this.participantRepository = participantRepository;
    this.participantInvitationRepository = participantInvitationRepository;
    this.participantValidationService = participantValidationService;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async findParticipantsInProceeding(userId: number, proceedingId: number) {
    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        userId,
        proceedingId,
      ))
    ) {
      throw new AppError(
        'UNAUTHORIZED',
        'Unauthorized to fetch participants of the proceeding',
      );
    }

    return await this.participantRepository.findProceedingParticipants(
      proceedingId,
    );
  }

  async inviteParticipantToProceeding(
    userId: number,
    input: ParticipantsInput,
  ): Promise<number[]> {
    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        userId,
        input.proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    let invitationIds: number[] = [];
    for (const participant of input.participants) {
      const token = createToken({ email: participant.email });

      const result =
        await this.participantInvitationRepository.createParticipantInvitation({
          proceedingId: input.proceedingId,
          participantEmail: participant.email!,
          participantFirstname: participant.firstname!,
          participantLastname: participant.lastname!,
          token: token,
          expiresAt: new Date(),
        });
      invitationIds.push(result);

      await this.emailService.sendParticipantInvitationEmail(
        participant.email!,
        participant.firstname!,
        participant.lastname!,
        token,
      );
    }
    return invitationIds;
  }

  async verifyParticipantInvitationToken(token: string) {
    const payload = parseAndVerifyJWT(token);
    if (!payload || !payload.email) {
      throw new AppError('INVALID_TOKEN');
    }
    return true;
  }

  async acceptParticipantInvitation(token: string) {
    const invitation =
      await this.participantInvitationRepository.getParticipantInvitationByToken(
        token,
      );
    if (!invitation) {
      throw new AppError('NOT_FOUND', 'Invitation not found or expired');
    }

    const registeredUser = await this.userRepository.getUserByEmail(
      invitation.participantEmail,
    );
    if (!registeredUser || registeredUser.id !== this.authUser!.id) {
      throw new AppError('UNAUTHORIZED', 'Unauthorized. Email mismatch.');
    }

    const isAlreadyParticipant =
      await this.participantValidationService.isUserParticipantInProceeding(
        registeredUser.id,
        invitation.proceedingId,
      );

    if (!isAlreadyParticipant) {
      await this.participantRepository.addParticipant({
        userId: registeredUser.id,
        proceedingId: invitation.proceedingId,
        participantStateId: PARTICIPANT_STATES.WAITING_FOR_APPROVAL,
      });
      await this.participantInvitationRepository.deleteParticipantInvitation(
        invitation.id,
      );
    }

    return invitation.proceedingId;
  }

  async approveParticipant(
    notaryId: number,
    proceedingId: number,
    participantId: number,
  ): Promise<ParticipantDTO> {
    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        notaryId,
        proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    await this.participantRepository.updateParticipantStatus(
      participantId,
      PARTICIPANT_STATES.APPROVED,
    );
    return await this.participantRepository.getParticipantById(participantId);
  }

  async rejectParticipant(
    notaryId: number,
    proceedingId: number,
    participantId: number,
  ): Promise<ParticipantDTO> {
    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        notaryId,
        proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    await this.participantRepository.updateParticipantStatus(
      participantId,
      PARTICIPANT_STATES.REJECTED,
    );
    return await this.participantRepository.getParticipantById(participantId);
  }

  async deleteParticipantById(
    notaryId: number,
    proceedingId: number,
    participantId: number,
  ): Promise<boolean> {
    if (
      !(await this.participantValidationService.isUserNotaryInProceeding(
        notaryId,
        proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    const deleteParticipant =
      await this.participantRepository.getParticipantById(participantId);

    if (!deleteParticipant) {
      throw new AppError(
        'NOT_FOUND',
        `Not found participant with id: ${participantId}`,
      );
    }

    try {
      await this.participantRepository.deleteParticipant(participantId);
    } catch (e) {
      throw new AppError(
        'DELETE_PARTICIPANT_ERROR',
        `Failed to delete participant with id: ${participantId}`,
      );
    }
    return true;
  }
}
