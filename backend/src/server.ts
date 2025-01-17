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
import { parseAndVerifyJWT } from '@backend/libs/jwt';
import { mockResolvers } from '@backend/mocks/mocks';
import { AssetsResolver } from '@backend/modules/assets/graphql/AssetsResolver';
import { AssetsService } from '@backend/modules/assets/services/AssetsService';
import { BlogResolver } from '@backend/modules/blog/graphql/BlogResolver';
import { BlogService } from '@backend/modules/blog/services/BlogService';
import { SendBulkEmailResolver } from '@backend/modules/bulkEmail/graphql/SendBulkEmailResolver';
import { BulkEmailService } from '@backend/modules/bulkEmail/services/BulkEmailService';
import { ChatResolver } from '@backend/modules/chat/graphql/ChatResolver';
import { pubSub } from '@backend/modules/chat/graphql/PubSub';
import { ChatService } from '@backend/modules/chat/services/ChatService';
import { EmailService } from '@backend/modules/emails/EmailService';
import { FileResolver } from '@backend/modules/files/graphql/FileResolver';
import { AwsService } from '@backend/modules/files/services/AwsService';
import { FileService } from '@backend/modules/files/services/FileService';
import { NotaryPaymentCalculationResolver } from '@backend/modules/notaryPaymentCalculation/graphql/NotaryPaymentCalculationResolver';
import { NotaryPaymentCalculationService } from '@backend/modules/notaryPaymentCalculation/services/NotaryPaymentCalculationService';
import { ParticipantsResolver } from '@backend/modules/participants/graphql/ParticipantsResolver';
import { ParticipantService } from '@backend/modules/participants/services/ParticipantService';
import { ProceedingResolver } from '@backend/modules/proceedings/graphql/ProceedingResolver';
import { ProceedingService } from '@backend/modules/proceedings/services/ProceedingService';
import { DistrictResolver } from '@backend/modules/schedules/graphql/DistrictResolver';
import { ScheduleResolver } from '@backend/modules/schedules/graphql/ScheduleResolver';
import { ScheduleService } from '@backend/modules/schedules/services/ScheduleService';
import { UserInvitationResolver } from '@backend/modules/users/graphql/UserInvitationResolver';
import { UserResolver } from '@backend/modules/users/graphql/UserResolver';
import { AuthenticationService } from '@backend/modules/users/services/AuthenticationService';
import { NotaryCriteriaService } from '@backend/modules/users/services/NotaryCriteriaService';
import { UserInvitationService } from '@backend/modules/users/services/UserInvitationService';
import { UserService } from '@backend/modules/users/services/UserService';
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
      BlogResolver,
      AssetsResolver,
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

    container.register({
      db: asValue(drizzle.db),
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
      blogService: container.resolve<BlogService>('blogService'),
      assetsService: container.resolve<AssetsService>('assetsService'),
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
