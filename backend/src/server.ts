import 'ts-node/register/transpile-only';
import 'tsconfig-paths/register';
import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { S3Client } from '@aws-sdk/client-s3';
import { addMocksToSchema } from '@graphql-tools/mock';
import cors from 'cors';
import express from 'express';
import { applyMiddleware } from 'graphql-middleware';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import nodemailer from 'nodemailer';
import { buildSchema } from 'type-graphql';
import { WebSocketServer } from 'ws';

import { MOCKS, PORT } from '@backend/config';
import { getConnection } from '@backend/db/db';
import { errorMiddleware } from '@backend/errors/errorMiddleware';
import { ChatResolver } from '@backend/graphql/modules/chat/ChatResolver';
import { pubSub } from '@backend/graphql/modules/chat/PubSub';
import { FileResolver } from '@backend/graphql/modules/file/FileResolver';
import { NotaryPaymentCalculationResolver } from '@backend/graphql/modules/notaryPaymentCalculation/NotaryPaymentCalculationResolver';
import { ParticipantsResolver } from '@backend/graphql/modules/participants/ParticipantsResolver';
import { ProceedingResolver } from '@backend/graphql/modules/proceedings/ProceedingResolver';
import { DistrictResolver } from '@backend/graphql/modules/schedules/DistrictResolver';
import { ScheduleResolver } from '@backend/graphql/modules/schedules/ScheduleResolver';
import { SendBulkEmailResolver } from '@backend/graphql/modules/sendBulkEmail/SendBulkEmailResolver';
import { UserResolver } from '@backend/graphql/modules/user/UserResolver';
import { parseAndVerifyJWT } from '@backend/libs/jwt';
import { mockResolvers } from '@backend/mocks/mocks';
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
import { CustomContext } from '@backend/types/types';

const init = async () => {
  const app = express();

  const httpServer = createServer(app);

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ScheduleResolver,
      ProceedingResolver,
      DistrictResolver,
      ChatResolver,
      SendBulkEmailResolver,
      FileResolver,
      ParticipantsResolver,
      NotaryPaymentCalculationResolver,
    ],
    emitSchemaFile: true,
    pubSub: pubSub,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const schemaWithMiddleware = applyMiddleware(schema, errorMiddleware);

  const server = new ApolloServer({
    schema: MOCKS
      ? addMocksToSchema({
          schema,
          resolvers: mockResolvers,
        })
      : schemaWithMiddleware,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  const customContext = async ({
    req,
    res,
  }: ExpressContextFunctionArgument): Promise<CustomContext> => {
    const drizzle = await getConnection();
    const authToken = req.headers.authorization ?? '';
    const authUser = parseAndVerifyJWT(authToken);

    res.on('close', () => {
      drizzle?.connection.end();
    });

    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_PASS || '',
      },
    });

    const proceedingRepository = new ProceedingRepository(drizzle.db);
    const fileRepository = new FileRepository(drizzle.db);

    const participantValidationService = new ParticipantValidationService(
      proceedingRepository,
    );
    const awsService = new AwsService(s3Client);
    const userRepository = new UserRepository(drizzle.db);
    const participantInvitationRepository = new ParticipantInvitationRepository(
      drizzle.db,
    );
    const emailService = new EmailService(transporter);
    const participantRepository = new ParticipantRepository(drizzle.db);
    const participantService = new ParticipantService(
      authUser,
      participantRepository,
      participantInvitationRepository,
      participantValidationService,
      userRepository,
      emailService,
    );
    const messageRepository = new MessageRepository(drizzle.db);
    const userService = new UserService(authUser, userRepository);
    const courtRepository = new CourtRepository(drizzle.db);
    const scheduleRepository = new ScheduleRepository(drizzle.db);
    const proceedingService = new ProceedingService(
      authUser,
      proceedingRepository,
      participantInvitationRepository,
      emailService,
      participantValidationService,
      userService,
    );

    return {
      db: drizzle.db,
      authUser,
      usersRepository: userRepository,
      proceedingsRepository: proceedingRepository,
      messageRepository: messageRepository,
      participantInvitationsRepository: participantInvitationRepository,
      participantRepository: new ParticipantRepository(drizzle.db),
      fileRepository: fileRepository,
      participantValidationService: participantValidationService,
      awsService: awsService,
      notaryPaymentCalculationService: new NotaryPaymentCalculationService(),
      emailService: emailService,
      fileService: new FileService(
        authUser,
        participantValidationService,
        fileRepository,
        awsService,
      ),
      participantsService: participantService,
      userService: userService,
      chatService: new ChatService(
        authUser,
        participantValidationService,
        messageRepository,
        proceedingService,
        participantService,
        emailService,
        userService,
      ),
      authenticationService: new AuthenticationService(
        userService,
        emailService,
      ),
      proceedingService: proceedingService,
      scheduleService: new ScheduleService(courtRepository, scheduleRepository),
      bulkEmailService: new BulkEmailService(
        authUser,
        participantValidationService,
        proceedingService,
        participantService,
        emailService,
      ),
    };
  };

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(), // accepts all origins ('*'), not support cookies
    express.json(),
    graphqlUploadExpress(),
    expressMiddleware(server, {
      context: customContext,
    }),
  );

  app.get('/', (_req, res) => {
    res.redirect('/graphql');
  });

  httpServer.listen({ port: PORT }, () => {
    console.log('🚀 Server listening on port: ' + PORT);
    console.log(`🚀 Subscription endpoint ready at ws://{url}:${PORT}/graphql`);
  });
};

init();
