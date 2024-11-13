export interface Sender {
  id: string;
  firstname: string;
  lastname: string;
}

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
