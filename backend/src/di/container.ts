import { S3Client } from '@aws-sdk/client-s3';
import { asClass, asValue, createContainer, InjectionMode } from 'awilix';
import nodemailer from 'nodemailer';

import { getConnection } from '@backend/db/db';
import { CourtRepository } from '@backend/repositories/CourtRepository';
import { FileRepository } from '@backend/repositories/FileRepository';
import { MessageRepository } from '@backend/repositories/MessageRepository';
import { ParticipantInvitationRepository } from '@backend/repositories/ParticipantInvitationRepository';
import { ParticipantRepository } from '@backend/repositories/ParticipantRepository';
import { ProceedingRepository } from '@backend/repositories/ProceedingRepository';
import { ScheduleRepository } from '@backend/repositories/ScheduleRepository';
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
  });

  return container;
};
