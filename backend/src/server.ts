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
import { MessageResolver } from '@backend/graphql/modules/chat/MessageResolver';
import { pubSub } from '@backend/graphql/modules/chat/PubSub';
import { DistrictResolver } from '@backend/graphql/modules/educator/DistrictResolver';
import { ScheduleResolver } from '@backend/graphql/modules/educator/ScheduleResolver';
import { FileResolver } from '@backend/graphql/modules/file/fileResolver';
import { NotaryPaymentCalculationResolver } from '@backend/graphql/modules/notaryPaymentCalculation/NotaryPaymentCalculationResolver';
import { ParticipantsResolver } from '@backend/graphql/modules/participants/ParticipantsResolver';
import { CreateProceedingResolver } from '@backend/graphql/modules/proceedings/create/CreateProceedingResolver';
import { DeleteProceedingResolver } from '@backend/graphql/modules/proceedings/delete/DeleteProceedingResolver';
import { GetProceedingsResolver } from '@backend/graphql/modules/proceedings/get/GetProceedingsResolver';
import { UpdateProceedingResolver } from '@backend/graphql/modules/proceedings/update/UpdateProceedingResolver';
import { SendBulkEmailResolver } from '@backend/graphql/modules/sendBulkEmail/SendBulkEmailResolver';
import { UserResolver } from '@backend/graphql/modules/user/userResolver';
import { parseAndVerifyJWT } from '@backend/libs/jwt';
import { mockResolvers } from '@backend/mocks/mocks';
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
import { ParticipantsService } from '@backend/services/ParticipantsService/ParticipantsService';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { CustomContext } from '@backend/types/types';

const init = async () => {
  const app = express();

  const httpServer = createServer(app);

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ScheduleResolver,
      CreateProceedingResolver,
      GetProceedingsResolver,
      UpdateProceedingResolver,
      DeleteProceedingResolver,
      DistrictResolver,
      MessageResolver,
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

    const proceedingsRepository = new ProceedingsRepository(drizzle.db);
    const filesRepository = new FilesRepository(drizzle.db);

    const participantValidationService = new ParticipantValidationService(
      proceedingsRepository,
    );
    const awsService = new AwsService(s3Client);
    const usersRepository = new UsersRepository(drizzle.db);
    const participantInvitationsRepository =
      new ParticipantInvitationsRepository(drizzle.db);
    const participantsRepository = new ParticipantsRepository(drizzle.db);
    const emailService = new EmailService(transporter);

    return {
      db: drizzle.db,
      authUser,
      usersRepository: usersRepository,
      proceedingsRepository: proceedingsRepository,
      messageRepository: new MessagesRepository(drizzle.db),
      participantInvitationsRepository: participantInvitationsRepository,
      participantsRepository: new ParticipantsRepository(drizzle.db),
      filesRepository: filesRepository,
      participantValidationService: participantValidationService,
      awsService: awsService,
      notaryPaymentCalculationService: new NotaryPaymentCalculationService(),
      emailService: emailService,
      fileService: new FileService(
        authUser,
        participantValidationService,
        filesRepository,
        awsService,
      ),
      participantsService: new ParticipantsService(
        authUser,
        participantsRepository,
        participantInvitationsRepository,
        usersRepository,
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
