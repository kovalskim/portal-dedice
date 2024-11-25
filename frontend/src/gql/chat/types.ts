import { User } from '@frontend/gql/user/types.ts';

export type Sender = Pick<User, 'id' | 'firstname' | 'lastname'>;

export interface Message {
  id: string;
  user: Sender;
  text: string;
  timestamp: Date;
}

export interface SendMessageArgs {
  text: string;
  proceedingId: number;
}

export interface NewMessageNotification {
  subscribeChat: {
    id: number;
  };
}
