import 'ts-node/register/transpile-only';
import 'tsconfig-paths/register';
import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware,
} from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { addMocksToSchema } from '@graphql-tools/mock';
import { asValue } from 'awilix';
import { scopePerRequest } from 'awilix-express';
import cors from 'cors';
import express from 'express';
import { applyMiddleware } from 'graphql-middleware';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { buildSchema } from 'type-graphql';
import { WebSocketServer } from 'ws';

import { MOCKS, PORT } from '@backend/config';
import { getConnection } from '@backend/db/db';
import { createDIContainer } from '@backend/di/container';
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
import { UserInvitationResolver } from '@backend/graphql/modules/user/UserInvitationResolver';
import { UserResolver } from '@backend/graphql/modules/user/UserResolver';
import { parseAndVerifyJWT } from '@backend/libs/jwt';
import { mockResolvers } from '@backend/mocks/mocks';
import { AuthenticationService } from '@backend/services/AuthenticationService/AuthenticationService';
import { AwsService } from '@backend/services/AwsService/AwsService';
import { BulkEmailService } from '@backend/services/BulkEmailService/BulkEmailService';
import { ChatService } from '@backend/services/ChatService/ChatService';
import { EmailService } from '@backend/services/EmailService/EmailService';
import { FileService } from '@backend/services/FileService/FileService';
import { NotaryCriteriaService } from '@backend/services/NotaryCriteriaService';
import { NotaryPaymentCalculationService } from '@backend/services/NotaryPaymentCalculationService/NotaryPaymentCalculationService';
import { ParticipantService } from '@backend/services/ParticipantService/ParticipantService';
import { ProceedingService } from '@backend/services/ProceedingService/ProceedingService';
import { ScheduleService } from '@backend/services/ScheduleService/ScheduleService';
import { UserInvitationService } from '@backend/services/UserInvitationService';
import { UserService } from '@backend/services/UserService/UserService';
import { CustomContext } from '@backend/types/types';

const init = async () => {
  const app = express();

  const container = await createDIContainer();
  app.use(scopePerRequest(container));

  //adds request-specific authUser to the scope
  app.use((req, res, next) => {
    const authToken = req.headers.authorization ?? '';
    const authUser = parseAndVerifyJWT(authToken);
    container.register({
      authUser: asValue(authUser),
    });

    next();
  });

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
      UserInvitationResolver,
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

    res.on('close', () => {
      drizzle?.connection.end();
    });

    return {
      db: container.resolve('db'),
      authUser: container.resolve('authUser'),
      awsService: container.resolve<AwsService>('awsService'),
      emailService: container.resolve<EmailService>('emailService'),
      participantValidationService: container.resolve(
        'participantValidationService',
      ),
      userService: container.resolve<UserService>('userService'),
      authenticationService: container.resolve<AuthenticationService>(
        'authenticationService',
      ),
      scheduleService: container.resolve<ScheduleService>('scheduleService'),
      notaryPaymentCalculationService:
        container.resolve<NotaryPaymentCalculationService>(
          'notaryPaymentCalculationService',
        ),
      proceedingService:
        container.resolve<ProceedingService>('proceedingService'),
      fileService: container.resolve<FileService>('fileService'),
      participantService:
        container.resolve<ParticipantService>('participantService'),
      chatService: container.resolve<ChatService>('chatService'),
      bulkEmailService: container.resolve<BulkEmailService>('bulkEmailService'),
      userInvitationService: container.resolve<UserInvitationService>(
        'userInvitationService',
      ),
      notaryCriteriaService: container.resolve<NotaryCriteriaService>(
        'notaryCriteriaService',
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
