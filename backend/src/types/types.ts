import { MySql2Database } from 'drizzle-orm/mysql2';

import { AuthenticationService } from '@backend/services/AuthenticationService/AuthenticationService';
import { AwsService } from '@backend/services/AwsService/AwsService';
import { BulkEmailService } from '@backend/services/BulkEmailService/BulkEmailService';
import { ChatService } from '@backend/services/ChatService/ChatService';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { FileService } from '@backend/services/FileService/FileService';
import { NotaryCriteriaService } from '@backend/services/NotaryCriteriaService';
import { NotaryPaymentCalculationService } from '@backend/services/NotaryPaymentCalculationService/NotaryPaymentCalculationService';
import { ParticipantService } from '@backend/services/ParticipantService/ParticipantService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { ProceedingService } from '@backend/services/ProceedingService/ProceedingService';
import { ScheduleService } from '@backend/services/ScheduleService/ScheduleService';
import { UserInvitationService } from '@backend/services/UserInvitationService';
import { UserService } from '@backend/services/UserService/UserService';

export type CustomContext = {
  db: MySql2Database<Record<string, unknown>>;
  authUser: JWTPayload | null;
  participantValidationService: ParticipantValidationService;
  awsService: AwsService;
  emailService: EmailService;
  notaryPaymentCalculationService: NotaryPaymentCalculationService;
  fileService: FileService;
  participantService: ParticipantService;
  userService: UserService;
  chatService: ChatService;
  authenticationService: AuthenticationService;
  proceedingService: ProceedingService;
  scheduleService: ScheduleService;
  bulkEmailService: BulkEmailService;
  userInvitationService: UserInvitationService;
  notaryCriteriaService: NotaryCriteriaService;
};

export type JWTPayload = {
  id: number;
  iat: number;
  email?: string;
  userId?: number;
  firstname?: string;
  lastname?: string;
  role?: string;
};
