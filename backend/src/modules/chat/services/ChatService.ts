import { AppError } from '@backend/errors/AppError';
import { MessageDTO } from '@backend/modules/chat/dtos/MessageDTO';
import { CHAT_TOPIC } from '@backend/modules/chat/graphql/ChatResolver';
import { pubSub } from '@backend/modules/chat/graphql/PubSub';
import { MessageRepository } from '@backend/modules/chat/repositories/MessageRepository';
import { EmailService } from '@backend/modules/emails/EmailService';
import { ParticipantService } from '@backend/modules/participants/services/ParticipantService';
import { ParticipantValidationService } from '@backend/modules/participants/services/ParticipantValidationService';
import { ProceedingDTO } from '@backend/modules/proceedings/dtos/ProceedingDTO';
import { ProceedingService } from '@backend/modules/proceedings/services/ProceedingService';
import { UserService } from '@backend/modules/users/services/UserService';
import { JWTPayload } from '@backend/types/types';

export class ChatService {
  private readonly authUser: JWTPayload | null;
  private readonly participantValidationService: ParticipantValidationService;
  private readonly messageRepository: MessageRepository;
  private readonly proceedingService: ProceedingService;
  private readonly participantService: ParticipantService;
  private readonly emailService: EmailService;
  private readonly userService: UserService;

  constructor(
    authUser: JWTPayload | null,
    participantValidationService: ParticipantValidationService,
    messageRepository: MessageRepository,
    proceedingService: ProceedingService,
    participantService: ParticipantService,
    emailService: EmailService,
    userService: UserService,
  ) {
    this.authUser = authUser;
    this.participantValidationService = participantValidationService;
    this.messageRepository = messageRepository;
    this.proceedingService = proceedingService;
    this.participantService = participantService;
    this.emailService = emailService;
    this.userService = userService;
  }

  async findAllMessagesByProceedingId(proceedingId: number) {
    // Check if user is participant in proceeding to get messages
    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        proceedingId,
      ))
    ) {
      throw new AppError(
        'UNAUTHORIZED',
        'User is not a participant in this proceeding',
      );
    }

    return await this.messageRepository.findMessagesByProceedingId(
      proceedingId,
    );
  }

  async createMessage(proceedingId: number, text: string) {
    if (
      !(await this.participantValidationService.isUserParticipantOrNotaryOfProceeding(
        this.authUser!.id,
        proceedingId,
      ))
    ) {
      throw new AppError(
        'UNAUTHORIZED',
        'User is not a participant in this proceeding',
      );
    }

    const proceeding = await this.proceedingService.getProceeding(
      this.authUser!.id,
      proceedingId,
    );
    if (!proceeding) {
      throw new AppError('NOT_FOUND', 'Proceeding with given id was not found');
    }

    if (await this.proceedingService.isProceedingFinished(proceedingId)) {
      throw new AppError('PROCEEDING_FINISHED');
    }

    const newMessageId = await this.messageRepository.createMessage(
      this.authUser!.id,
      proceedingId,
      text,
    );

    const newMessage =
      await this.messageRepository.getMessageById(newMessageId);
    if (!newMessage) {
      throw new AppError('SERVER_ERROR', 'Something went wrong');
    }

    pubSub.publish(CHAT_TOPIC, {
      newMessageId: newMessage.id,
      proceedingId: proceeding.id,
    });

    await this.notifyParticipantsAndNotary(newMessage, proceeding);

    return newMessage;
  }

  private async notifyParticipantsAndNotary(
    newMessage: MessageDTO,
    proceeding: ProceedingDTO,
  ) {
    // notify participants about new message
    const participants =
      await this.participantService.findParticipantsInProceeding(
        this.authUser!.id,
        proceeding.id,
      );
    const sender = await this.userService.getUserById(newMessage.userId);
    for (const participant of participants) {
      if (
        participant.user.id !== this.authUser!.id &&
        participant.user.emailNotifications
      ) {
        this.emailService.sendNewMessageNotification(
          participant.user.email,
          participant.user.firstname,
          `${sender.firstname} ${sender.lastname}`,
          newMessage.text,
          proceeding.id,
          proceeding.proceedingNumber,
        );
      }
    }

    // notify also notary
    if (proceeding.notaryId !== this.authUser!.id) {
      const notary = await this.userService.getUserById(proceeding.notaryId);
      if (notary && notary.emailNotifications) {
        this.emailService.sendNewMessageNotification(
          notary.email,
          notary.firstname,
          `${sender.firstname} ${sender.lastname}`,
          newMessage.text,
          proceeding.id,
          proceeding.proceedingNumber,
        );
      }
    }
  }
}
