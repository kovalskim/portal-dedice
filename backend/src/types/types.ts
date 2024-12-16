import { MySql2Database } from 'drizzle-orm/mysql2';

import { FileRepository } from '@backend/repositories/FileRepository';
import { MessageRepository } from '@backend/repositories/MessageRepository';
import { ParticipantInvitationRepository } from '@backend/repositories/ParticipantInvitationRepository';
import { ParticipantRepository } from '@backend/repositories/ParticipantRepository';
import { ProceedingRepository } from '@backend/repositories/ProceedingRepository';
import { UserRepository } from '@backend/repositories/UserRepository';
import { AuthenticationService } from '@backend/services/AuthenticationService/AuthenticationService';
import { AwsService } from '@backend/services/AwsService/AwsService';
import { BulkEmailService } from '@backend/services/BulkEmailService/BulkEmailService';
import { ChatService } from '@backend/services/ChatService/ChatService';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { FileService } from '@backend/services/FileService/FileService';
import { NotaryPaymentCalculationService } from '@backend/services/NotaryPaymentCalculationService/NotaryPaymentCalculationService';
import { ParticipantService } from '@backend/services/ParticipantService/ParticipantService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { ProceedingService } from '@backend/services/ProceedingService/ProceedingService';
import { ScheduleService } from '@backend/services/ScheduleService/ScheduleService';
import { UserService } from '@backend/services/UserService/UserService';

export type CustomContext = {
  db: MySql2Database<Record<string, unknown>>;
  authUser: JWTPayload | null;
  usersRepository: UserRepository;
  proceedingsRepository: ProceedingRepository;
  messageRepository: MessageRepository;
  fileRepository: FileRepository;
  participantInvitationsRepository: ParticipantInvitationRepository;
  participantRepository: ParticipantRepository;
  participantValidationService: ParticipantValidationService;
  awsService: AwsService;
  emailService: EmailService;
  notaryPaymentCalculationService: NotaryPaymentCalculationService;
  fileService: FileService;
  participantsService: ParticipantService;
  userService: UserService;
  chatService: ChatService;
  authenticationService: AuthenticationService;
  proceedingService: ProceedingService;
  scheduleService: ScheduleService;
  bulkEmailService: BulkEmailService;
};

export type JWTPayload = {
  id: number;
  iat: number;
  email?: string;
  userId: number;
};

export type ParticipantInvitationJWTPayload = {
  id: number;
  iat: number;
  email: string;
};
