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
import { DistrictResolver } from '@backend/graphql/modules/educator/DistrictResolver';
import { ScheduleResolver } from '@backend/graphql/modules/educator/ScheduleResolver';
import { AcceptParticipantInvitationResolver } from '@backend/graphql/modules/participantInvitation/AcceptParticipantInvitationResolver';
import { UserResolver } from '@backend/graphql/modules/user/userResolver';
import { parseAndVerifyJWT } from '@backend/libs/jwt';
import { mockResolvers } from '@backend/mocks/mocks';
import { ProceedingsRepository } from '@backend/repository/ProceedingsRepository';
import { UsersRepository } from '@backend/repository/UsersRepository';
import { CustomContext } from '@backend/types/types';

import { MessageResolver } from './graphql/modules/chat/MessageResolver';
import { pubSub } from './graphql/modules/chat/PubSub';
import { CreateProceedingsResolver } from './graphql/modules/proceedings/create/CreateProceedingsResolver';
import { DeleteProceedingsResolver } from './graphql/modules/proceedings/delete/DeleteProceedingsResolver';
import { GetProceedingsResolver } from './graphql/modules/proceedings/get/GetProceedingsResolver';
import { SendMessageResolver } from './graphql/modules/proceedings/send/SendMessageResolver';
import { UpdateProceedingsResolver } from './graphql/modules/proceedings/update/UpdateProceedingsResolver';
import { MessagesRepository } from './repository/MessagesRepository';
import { ParticipantInvitationsRepository } from './repository/ParticipantInvitationsRepository';
import { ParticipantsRepository } from './repository/ParticipantsRepository';

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

    return {
      db: drizzle.db,
      authUser,
      usersRepository: new UsersRepository(drizzle.db),
      proceedingsRepository: new ProceedingsRepository(drizzle.db),
      messageRepository: new MessagesRepository(drizzle.db),
      participantInvitationsRepository: new ParticipantInvitationsRepository(
        drizzle.db,
      ),
      participantsRepository: new ParticipantsRepository(drizzle.db),
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
