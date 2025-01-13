import { MySql2Database } from 'drizzle-orm/mysql2';

import { AssetsService } from '@backend/modules/assets/services/AssetsService';
import { BlogService } from '@backend/modules/blog/services/BlogService';
import { BulkEmailService } from '@backend/modules/bulkEmail/services/BulkEmailService';
import { ChatService } from '@backend/modules/chat/services/ChatService';
import { EmailService } from '@backend/modules/emails/EmailService';
import { AwsService } from '@backend/modules/files/services/AwsService';
import { FileService } from '@backend/modules/files/services/FileService';
import { NotaryPaymentCalculationService } from '@backend/modules/notaryPaymentCalculation/services/NotaryPaymentCalculationService';
import { ParticipantService } from '@backend/modules/participants/services/ParticipantService';
import { ParticipantValidationService } from '@backend/modules/participants/services/ParticipantValidationService';
import { ProceedingService } from '@backend/modules/proceedings/services/ProceedingService';
import { ScheduleService } from '@backend/modules/schedules/services/ScheduleService';
import { AuthenticationService } from '@backend/modules/users/services/AuthenticationService';
import { NotaryCriteriaService } from '@backend/modules/users/services/NotaryCriteriaService';
import { UserInvitationService } from '@backend/modules/users/services/UserInvitationService';
import { UserService } from '@backend/modules/users/services/UserService';

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
  blogService: BlogService;
  assetsService: AssetsService;
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
