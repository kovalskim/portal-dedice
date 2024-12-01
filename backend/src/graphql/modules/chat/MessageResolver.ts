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

import { serverError, unauthorizedError } from '@backend/errors/graphqlErrors';
import {
  Message,
  NewMessageNotification,
} from '@backend/graphql/modules/chat/MessageType';
import {
  NewMessagePayload,
  pubSub,
} from '@backend/graphql/modules/chat/PubSub';
import { User } from '@backend/graphql/modules/user/userType';
import { CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

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
  @Authenticated()
  async allMessagesByProceedingId(
    @Arg('proceedingId') proceedingId: number,
    @Ctx()
    {
      authUser,
      participantValidationService,
      messageRepository,
    }: AuthenticatedContext,
  ): Promise<Message[]> {
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
  @Authenticated()
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
      emailService,
    }: AuthenticatedContext,
  ): Promise<Message> {
    if (
      !(await participantValidationService.isUserParticipantOrNotaryOfProceeding(
        authUser.id,
        proceedingId,
      ))
    ) {
      throw unauthorizedError('User is not a participant in this proceeding');
    }

    const proceeding =
      await proceedingsRepository.getProceedingById(proceedingId);

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
        emailService.sendNewMessageNotification(
          participant.user.email,
          participant.user.firstname,
          `${newMessage.user.firstname} ${newMessage.user.lastname}`,
          newMessage.text,
          proceedingId,
          proceeding.proceedingNumber,
        );
      }
    }

    // notify also notary
    if (proceeding.notaryId !== authUser.id) {
      const notary = await usersRepository.getUserById(proceeding.notaryId);
      if (notary && notary.emailNotifications) {
        emailService.sendNewMessageNotification(
          notary.email,
          notary.firstname,
          `${newMessage.user.firstname} ${newMessage.user.lastname}`,
          newMessage.text,
          proceedingId,
          proceeding.proceedingNumber,
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
