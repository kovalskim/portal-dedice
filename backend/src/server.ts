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
import cors from 'cors';
import express from 'express';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { buildSchema } from 'type-graphql';
import { WebSocketServer } from 'ws';

import { MOCKS, PORT } from '@backend/config';
import { getConnection } from '@backend/db/db';
import { MessageResolver } from '@backend/graphql/modules/chat/MessageResolver';
import { pubSub } from '@backend/graphql/modules/chat/PubSub';
import { DistrictResolver } from '@backend/graphql/modules/educator/DistrictResolver';
import { ScheduleResolver } from '@backend/graphql/modules/educator/ScheduleResolver';
import { FileResolver } from '@backend/graphql/modules/file/fileResolver';
import { AcceptParticipantInvitationResolver } from '@backend/graphql/modules/participantInvitation/AcceptParticipantInvitationResolver';
import { CreateProceedingsResolver } from '@backend/graphql/modules/proceedings/create/CreateProceedingsResolver';
import { DeleteProceedingsResolver } from '@backend/graphql/modules/proceedings/delete/DeleteProceedingsResolver';
import { GetProceedingsResolver } from '@backend/graphql/modules/proceedings/get/GetProceedingsResolver';
import { SendMessageResolver } from '@backend/graphql/modules/proceedings/send/SendMessageResolver';
import { UpdateProceedingsResolver } from '@backend/graphql/modules/proceedings/update/UpdateProceedingsResolver';
import { UserResolver } from '@backend/graphql/modules/user/userResolver';
import { parseAndVerifyJWT } from '@backend/libs/jwt';
import { mockResolvers } from '@backend/mocks/mocks';
import { FilesRepository } from '@backend/repository/FilesRepository';
import { MessagesRepository } from '@backend/repository/MessagesRepository';
import { ParticipantInvitationsRepository } from '@backend/repository/ParticipantInvitationsRepository';
import { ParticipantsRepository } from '@backend/repository/ParticipantsRepository';
import { ProceedingsRepository } from '@backend/repository/ProceedingsRepository';
import { UsersRepository } from '@backend/repository/UsersRepository';
import { ParticipantValidationService } from '@backend/services/ParticipantValidationService/ParticipantValidationService';
import { CustomContext } from '@backend/types/types';

const init = async () => {
  const app = express();

  const httpServer = createServer(app);

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ScheduleResolver,
      CreateProceedingsResolver,
      GetProceedingsResolver,
      UpdateProceedingsResolver,
      DeleteProceedingsResolver,
      DistrictResolver,
      MessageResolver,
      SendMessageResolver,
      AcceptParticipantInvitationResolver,
      FileResolver,
    ],
    emitSchemaFile: true,
    pubSub: pubSub,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema: MOCKS
      ? addMocksToSchema({
          schema,
          resolvers: mockResolvers,
        })
      : schema,
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

    const proceedingRepository = new ProceedingsRepository(drizzle.db);

    return {
      db: drizzle.db,
      authUser,
      usersRepository: new UsersRepository(drizzle.db),
      proceedingsRepository: proceedingRepository,
      messageRepository: new MessagesRepository(drizzle.db),
      participantInvitationsRepository: new ParticipantInvitationsRepository(
        drizzle.db,
      ),
      participantsRepository: new ParticipantsRepository(drizzle.db),
      filesRepository: new FilesRepository(drizzle.db),
      participantValidationService: new ParticipantValidationService(
        proceedingRepository,
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
