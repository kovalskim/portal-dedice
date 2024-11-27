import { MySql2Database } from 'drizzle-orm/mysql2';

import { FilesRepository } from '@backend/repository/FilesRepository';
import { MessagesRepository } from '@backend/repository/MessagesRepository';
import { ParticipantInvitationsRepository } from '@backend/repository/ParticipantInvitationsRepository';
import { ParticipantsRepository } from '@backend/repository/ParticipantsRepository';
import { ProceedingsRepository } from '@backend/repository/ProceedingsRepository';
import { UsersRepository } from '@backend/repository/UsersRepository';
import { AwsService } from '@backend/services/AwsService/AwsService';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { FileService } from '@backend/services/FileService/FileService';
import { NotaryPaymentCalculationService } from '@backend/services/NotaryPaymentCalculationService/NotaryPaymentCalculationService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';

export type CustomContext = {
  db: MySql2Database<Record<string, unknown>>;
  authUser: JWTPayload | null;
  usersRepository: UsersRepository;
  proceedingsRepository: ProceedingsRepository;
  messageRepository: MessagesRepository;
  filesRepository: FilesRepository;
  participantInvitationsRepository: ParticipantInvitationsRepository;
  participantsRepository: ParticipantsRepository;
  participantValidationService: ParticipantValidationService;
  awsService: AwsService;
  emailService: EmailService;
  notaryPaymentCalculationService: NotaryPaymentCalculationService;
  fileService: FileService;
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
