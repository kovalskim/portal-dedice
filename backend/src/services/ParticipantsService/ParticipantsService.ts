import { AppError } from '@backend/errors/AppError';
import { ParticipantsInput } from '@backend/graphql/modules/participants/ParticipantsInput';
import {
  createToken,
  parseAndVerifyParticipationInvitationJWT,
} from '@backend/libs/jwt';
import { ParticipantInvitationsRepository } from '@backend/repository/ParticipantInvitationsRepository';
import {
  ParticipantDTO,
  ParticipantsRepository,
} from '@backend/repository/ParticipantsRepository';
import { UsersRepository } from '@backend/repository/UsersRepository';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { JWTPayload } from '@backend/types/types';
import { PARTICIPANT_STATES } from '@backend/utils/constants';

export class ParticipantsService {
  private readonly participantsRepository: ParticipantsRepository;
  private readonly participantInvitationsRepository: ParticipantInvitationsRepository;
  private readonly usersRepository: UsersRepository;
  private readonly authUser: JWTPayload | null;
  private readonly emailService: EmailService;

  constructor(
    authUser: JWTPayload | null,
    participantsRepository: ParticipantsRepository,
    participantInvitationsRepository: ParticipantInvitationsRepository,
    usersRepository: UsersRepository,
    emailService: EmailService,
  ) {
    this.authUser = authUser;
    this.participantsRepository = participantsRepository;
    this.participantInvitationsRepository = participantInvitationsRepository;
    this.usersRepository = usersRepository;
    this.emailService = emailService;
  }

  async inviteParticipantToProceeding(
    input: ParticipantsInput,
  ): Promise<number[]> {
    let invitationIds: number[] = [];
    for (const participant of input.participants) {
      const token = createToken({ email: participant.email });

      const result =
        await this.participantInvitationsRepository.createParticipantInvitation(
          {
            proceedingId: input.proceedingId,
            participantEmail: participant.email!,
            participantFirstname: participant.firstname!,
            participantLastname: participant.lastname!,
            token: token,
            expiresAt: new Date(),
          },
        );
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

  async acceptParticipantInvitation(token: string) {
    const payload = parseAndVerifyParticipationInvitationJWT(token);
    if (!payload || !payload.email) {
      throw new AppError('INVALID_TOKEN');
    }

    const invitation =
      await this.participantInvitationsRepository.getParticipantInvitationByToken(
        token,
      );
    if (!invitation) {
      throw new AppError('NOT_FOUND', 'Invitation not found or expired');
    }

    const registeredUser = await this.usersRepository.getUserByEmail(
      payload.email,
    );
    if (!registeredUser || registeredUser.id !== this.authUser!.id) {
      throw new AppError('UNAUTHORIZED', 'Unauthorized. Email mismatch.');
    }

    const isAlreadyParticipant =
      await this.participantsRepository.isUserParticipantInProceeding(
        registeredUser.id,
        invitation.proceedingId,
      );

    if (!isAlreadyParticipant) {
      await this.participantsRepository.addParticipant({
        userId: registeredUser.id,
        proceedingId: invitation.proceedingId,
        participantStateId: PARTICIPANT_STATES.WAITING_FOR_APPROVAL,
      });
      await this.participantInvitationsRepository.deleteParticipantInvitation(
        invitation.id,
      );
    }

    return invitation.proceedingId;
  }

  async approveParticipant(id: number): Promise<ParticipantDTO> {
    await this.participantsRepository.updateParticipantStatus(
      id,
      PARTICIPANT_STATES.APPROVED,
    );
    return await this.participantsRepository.getParticipantById(id);
  }

  async rejectParticipant(id: number): Promise<ParticipantDTO> {
    await this.participantsRepository.updateParticipantStatus(
      id,
      PARTICIPANT_STATES.REJECTED,
    );
    return await this.participantsRepository.getParticipantById(id);
  }

  async deleteParticipantById(id: number): Promise<boolean> {
    const deleteParticipant =
      await this.participantsRepository.getParticipantById(id);

    if (!deleteParticipant) {
      throw new AppError('NOT_FOUND', `Not found participant with id: ${id}`);
    }

    try {
      await this.participantsRepository.deleteParticipant(id);
    } catch (e) {
      throw new AppError(
        'DELETE_PARTICIPANT_ERROR',
        `Failed to delete participant with id: ${id}`,
      );
    }
    return true;
  }
}
