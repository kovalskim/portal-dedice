import { S3Client } from '@aws-sdk/client-s3';
import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import nodemailer from 'nodemailer';

import { getConnection } from '@backend/db/db';
import { AssetRepository } from '@backend/repositories/AssetRepository';
import { BlogRepository } from '@backend/repositories/BlogRepository';
import { CourtRepository } from '@backend/repositories/CourtRepository';
import { CriteriaRepository } from '@backend/repositories/CriteriaRepository';
import { FileRepository } from '@backend/repositories/FileRepository';
import { MessageRepository } from '@backend/repositories/MessageRepository';
import { ParticipantInvitationRepository } from '@backend/repositories/ParticipantInvitationRepository';
import { ParticipantRepository } from '@backend/repositories/ParticipantRepository';
import { ProceedingRepository } from '@backend/repositories/ProceedingRepository';
import { ScheduleRepository } from '@backend/repositories/ScheduleRepository';
import { UserInvitationRepository } from '@backend/repositories/UserInvitationRepository';
import { UserRepository } from '@backend/repositories/UserRepository';
import { AssetsService } from '@backend/services/AssetsService/AssetsService';
import { AuthenticationService } from '@backend/services/AuthenticationService/AuthenticationService';
import { AwsService } from '@backend/services/AwsService/AwsService';
import { BlogService } from '@backend/services/BlogService/BlogService';
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

export const createDIContainer = async () => {
  const container = createContainer({
    injectionMode: InjectionMode.CLASSIC,
    strict: true,
  });

  const drizzle = await getConnection();

  container.register({
    db: asValue(drizzle.db),
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
