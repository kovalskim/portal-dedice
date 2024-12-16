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

import {
  Message,
  NewMessageNotification,
} from '@backend/graphql/modules/chat/MessageType';
import { NewMessagePayload } from '@backend/graphql/modules/chat/PubSub';
import { User } from '@backend/graphql/modules/user/userType';
import { CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

export const CHAT_TOPIC = 'CHAT_TOPIC';

@Resolver(() => Message)
export class ChatResolver {
  @FieldResolver(() => User)
  async user(
    @Root() message: Message,
    @Ctx() { userService }: CustomContext,
  ): Promise<User> {
    return userService.getUserById(message.userId);
  }

  @Query(() => [Message])
  @Authenticated()
  async allMessagesByProceedingId(
    @Arg('proceedingId') proceedingId: number,
    @Ctx()
    { chatService }: AuthenticatedContext,
  ): Promise<Message[]> {
    return chatService.findAllMessagesByProceedingId(proceedingId);
  }

  @Mutation(() => Message)
  @Authenticated()
  async createMessage(
    @Arg('proceedingId') proceedingId: number,
    @Arg('text') text: string,
    @Ctx()
    { chatService }: AuthenticatedContext,
  ): Promise<Message> {
    return chatService.createMessage(proceedingId, text);
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
