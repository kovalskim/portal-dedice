import { GraphQLError } from 'graphql';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql';

import { serverError, unauthorizedError } from '@backend/graphql/errors';
import {
  Message,
  NewMessageNotification,
} from '@backend/graphql/modules/chat/MessageType';
import {
  NewMessagePayload,
  pubSub,
} from '@backend/graphql/modules/chat/PubSub';
import { User } from '@backend/graphql/modules/user/userType';
import { sendNewMessageNotification } from '@backend/services/emailService/emailService';
import { CustomContext } from '@backend/types/types';

export const CHAT_TOPIC = 'CHAT_TOPIC';

@Resolver(() => Message)
export class MessageResolver {
  @FieldResolver(() => User)
  async user(
    @Root() message: Message,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<User> {
    if (!message.userId || !usersRepository) {
      throw serverError('Message does not have a user');
    }
    return usersRepository.getUserById(message.userId);
  }

  @Query(() => [Message])
  async allMessagesByProceedingId(
    @Arg('proceedingId') proceedingId: number,
    @Ctx()
    {
      authUser,
      participantValidationService,
      messageRepository,
    }: CustomContext,
  ): Promise<Message[]> {
    if (!authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    // Check if user is participant in proceeding to get messages
    if (
      !(await participantValidationService.isUserParticipantOrNotaryOfProceeding(
        authUser.id,
        proceedingId,
      ))
    ) {
      throw unauthorizedError('User is not a participant in this proceeding');
    }

    return await messageRepository.getMessagesWithUsersByProceedingId(
      proceedingId,
    );
  }

  @Mutation(() => Message)
  async createMessage(
    @Arg('proceedingId') proceedingId: number,
    @Arg('text') text: string,
    @Ctx()
    {
      authUser,
      proceedingsRepository,
      messageRepository,
      usersRepository,
      participantValidationService,
    }: CustomContext,
  ): Promise<Message> {
    if (!authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    if (
      !(await participantValidationService.isUserParticipantOrNotaryOfProceeding(
        authUser.id,
        proceedingId,
      ))
    ) {
      throw unauthorizedError('User is not a participant in this proceeding');
    }

    const newMessageId = await messageRepository.createMessage(
      authUser.id,
      proceedingId,
      text,
    );

    const newMessage =
      await messageRepository.getMessageWithUserById(newMessageId);
    if (!newMessage) {
      throw serverError('Something went wrong');
    }

    // Notify all subscribers about new message
    pubSub.publish(CHAT_TOPIC, {
      newMessageId: newMessage.id,
      proceedingId: proceedingId,
    });

    const participants =
      await proceedingsRepository.getProceedingParticipants(proceedingId);
    for (const participant of participants) {
      if (
        participant.user.id !== authUser.id &&
        participant.user.emailNotifications
      ) {
        sendNewMessageNotification(
          participant.user.email,
          `${newMessage.user.firstname} ${newMessage.user.lastname}`,
          newMessage.text,
          proceedingId,
        );
      }
    }

    // notify also notary
    const proceeding =
      await proceedingsRepository.getProceedingsById(proceedingId);
    if (proceeding.notaryId !== authUser.id) {
      const notary = await usersRepository.getUserById(proceeding.notaryId);
      if (notary && notary.emailNotifications) {
        sendNewMessageNotification(
          notary.email,
          `${newMessage.user.firstname} ${newMessage.user.lastname}`,
          newMessage.text,
          proceedingId,
        );
      }
    }

    return newMessage;
  }

  @Subscription(() => NewMessageNotification, {
    topics: CHAT_TOPIC,
    filter: ({ payload, args }) => payload.proceedingId === args.proceedingId,
  })
  // return id of a new message... this ****er is not working with context so I can't get user data
  // client will have to fetch new message or all messages after receiving new message id, I don't have time to be fixing this
  // if you try to fix it, increase this counter of hours spend on this: 4
  subscribeChat(
    @Root() newMessagePayload: NewMessagePayload,
    @Arg('proceedingId') _proceedingId: number,
  ): NewMessageNotification {
    return { id: newMessagePayload.newMessageId };
  }
}
