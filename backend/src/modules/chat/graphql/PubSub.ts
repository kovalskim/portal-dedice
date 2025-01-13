import { createPubSub } from '@graphql-yoga/subscription';

export interface NewMessagePayload {
  newMessageId: number;
  proceedingId: number;
}

export const pubSub = createPubSub<{
  CHAT_TOPIC: [NewMessagePayload];
}>();
