import { S3Client } from '@aws-sdk/client-s3';
import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import nodemailer from 'nodemailer';

import { AssetRepository } from '@backend/modules/assets/repositories/AssetRepository';
import { AssetsService } from '@backend/modules/assets/services/AssetsService';
import { BlogRepository } from '@backend/modules/blog/repositories/BlogRepository';
import { BlogService } from '@backend/modules/blog/services/BlogService';
import { BulkEmailService } from '@backend/modules/bulkEmail/services/BulkEmailService';
import { MessageRepository } from '@backend/modules/chat/repositories/MessageRepository';
import { ChatService } from '@backend/modules/chat/services/ChatService';
import { EmailService } from '@backend/modules/emails/EmailService';
import { FileRepository } from '@backend/modules/files/repositories/FileRepository';
import { AwsService } from '@backend/modules/files/services/AwsService';
import { FileService } from '@backend/modules/files/services/FileService';
import { NotaryPaymentCalculationService } from '@backend/modules/notaryPaymentCalculation/services/NotaryPaymentCalculationService';
import { ParticipantInvitationRepository } from '@backend/modules/participants/repositories/ParticipantInvitationRepository';
import { ParticipantRepository } from '@backend/modules/participants/repositories/ParticipantRepository';
import { ParticipantService } from '@backend/modules/participants/services/ParticipantService';
import { ParticipantValidationService } from '@backend/modules/participants/services/ParticipantValidationService';
import { ProceedingRepository } from '@backend/modules/proceedings/repositories/ProceedingRepository';
import { ProceedingService } from '@backend/modules/proceedings/services/ProceedingService';
import { CourtRepository } from '@backend/modules/schedules/repositories/CourtRepository';
import { ScheduleRepository } from '@backend/modules/schedules/repositories/ScheduleRepository';
import { ScheduleService } from '@backend/modules/schedules/services/ScheduleService';
import { CriteriaRepository } from '@backend/modules/users/repositories/CriteriaRepository';
import { UserInvitationRepository } from '@backend/modules/users/repositories/UserInvitationRepository';
import { UserRepository } from '@backend/modules/users/repositories/UserRepository';
import { AuthenticationService } from '@backend/modules/users/services/AuthenticationService';
import { NotaryCriteriaService } from '@backend/modules/users/services/NotaryCriteriaService';
import { UserInvitationService } from '@backend/modules/users/services/UserInvitationService';
import { UserService } from '@backend/modules/users/services/UserService';

export const createDIContainer = async () => {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
  });

  container.register({
    s3Client: asValue(new S3Client({ region: process.env.AWS_REGION })),
    transporter: asValue(
      nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_USER || '',
          pass: process.env.GMAIL_PASS || '',
        },
      }),
    ),
    // repositories
    proceedingRepository: asClass(ProceedingRepository),
    userRepository: asClass(UserRepository),
    participantRepository: asClass(ParticipantRepository),
    participantInvitationRepository: asClass(ParticipantInvitationRepository),
    messageRepository: asClass(MessageRepository),
    courtRepository: asClass(CourtRepository),
    scheduleRepository: asClass(ScheduleRepository),
    fileRepository: asClass(FileRepository),
    userInvitationRepository: asClass(UserInvitationRepository),
    criteriaRepository: asClass(CriteriaRepository),
    blogRepository: asClass(BlogRepository),
    assetRepository: asClass(AssetRepository),
    // services
    awsService: asClass(AwsService),
    emailService: asClass(EmailService),
    participantValidationService: asClass(ParticipantValidationService),
    userService: asClass(UserService),
    authenticationService: asClass(AuthenticationService),
    scheduleService: asClass(ScheduleService),
    notaryPaymentCalculationService: asClass(NotaryPaymentCalculationService),
    proceedingService: asClass(ProceedingService),
    participantService: asClass(ParticipantService),
    chatService: asClass(ChatService),
    fileService: asClass(FileService),
    bulkEmailService: asClass(BulkEmailService),
    userInvitationService: asClass(UserInvitationService),
    notaryCriteriaService: asClass(NotaryCriteriaService),
    blogService: asClass(BlogService),
    assetsService: asClass(AssetsService),
  });

  return container;
};
