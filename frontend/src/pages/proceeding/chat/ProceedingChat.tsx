import { useEffect, useState } from 'react';
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { Flex, Input, Spinner, Text } from '@chakra-ui/react';
import { useWindowSize } from '@uidotdev/usehooks';
import { useParams } from 'react-router-dom';

import { Form, PrimaryButton } from '@frontend/components';
import { useAuth } from '@frontend/context/auth';
import { CREATE_MESSAGE_MUTATION } from '@frontend/gql/chat/mutations';
import { ALL_MESSAGES_BY_PROCEEDING_ID } from '@frontend/gql/chat/queries';
import { CHAT_SUBSCRIPTION } from '@frontend/gql/chat/subscriptions';
import {
  Message as MessageType,
  NewMessageNotification,
  SendMessageArgs,
} from '@frontend/gql/chat/types';
import { useCustomToast } from '@frontend/hooks/useCustomToast';

import { Message } from './Message';

export const ProceedingChat = () => {
  const proceedingId = useParams<{ id: string }>().id;
  const { user } = useAuth();
  const { height } = useWindowSize();
  const showToast = useCustomToast();

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [actualMessage, setActualMessage] = useState<string>('');

  const {
    data: allMessages,
    loading: allMessagesLoading,
    error: allMessagesError,
    refetch: refetchMessages,
  } = useQuery<{ allMessagesByProceedingId: MessageType[] }>(
    ALL_MESSAGES_BY_PROCEEDING_ID,
    {
      variables: { proceedingId: parseFloat(proceedingId ?? 'NaN') },
    },
  );

  const { error: chatSubscriptionError } =
    useSubscription<NewMessageNotification>(CHAT_SUBSCRIPTION, {
      variables: { proceedingId: parseFloat(proceedingId ?? 'NaN') },
      onData: (newData) => {
        const newMessage = newData.data?.data?.subscribeChat;
        if (newMessage) {
          refetchMessages();
        }
      },
      errorPolicy: 'ignore',
    });

  const [
    sendMessage,
    { loading: sendingMessageLoading, error: sendingMessageError },
  ] = useMutation<SendMessageArgs>(CREATE_MESSAGE_MUTATION);

  useEffect(() => {
    if (allMessages) {
      setMessages(
        allMessages.allMessagesByProceedingId.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      );
    }
  }, [allMessages]);

  const handleSubmit = () => {
    if (actualMessage === '') {
      return;
    }

    sendMessage({
      variables: {
        text: actualMessage,
        proceedingId: parseFloat(proceedingId ?? 'NaN'),
      },
    });

    setActualMessage('');
  };

  useEffect(() => {
    if (allMessagesError || chatSubscriptionError) {
      showToast({
        title: 'Nepodařilo se načíst zprávy',
        description: 'Při načítání zpráv dědického řízení se vyskytla chyba.',
        status: 'error',
      });
    }
  }, [allMessagesError, chatSubscriptionError, showToast]);

  useEffect(() => {
    if (sendingMessageError) {
      showToast({
        title: 'Nepodařilo se odeslat zprávu',
        description: 'Při odesílání zprávy se vyskytla chyba.',
        status: 'error',
      });
    }
  }, [sendingMessageError, showToast]);

  if (allMessagesLoading && messages.length === 0) {
    return (
      <Flex width="full" justifyContent="center" gap={10} my="auto">
        <Spinner size="md" color="goldenYellow.500" />
        <Text color="goldenYellow.500">Načítání zpráv</Text>
      </Flex>
    );
  }

  return (
    <Flex flexDirection={'column'} gap={8} flex={1} overflow="hidden">
      <Flex
        flexDir={'column-reverse'}
        gap={4}
        maxH={height ? height * 0.5 : '50vh'} // TODO: not sure about this...
        overflowY={'auto'}
        flex={1}
        p={2}
      >
        {messages
          .toSorted((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .map((message) => (
            <Message
              key={message.id}
              message={message}
              myMessage={user?.id.toString() === message.user.id}
            />
          ))}
      </Flex>
      <Form onSubmit={handleSubmit}>
        <Flex flexDirection={'row'} width={'100%'} gap={8}>
          <Input
            placeholder="Začnete psát zprávu..."
            flex={1}
            value={actualMessage}
            onChange={(e) => setActualMessage(e.target.value)}
          />
          <PrimaryButton type="submit" isLoading={sendingMessageLoading}>
            Poslat
          </PrimaryButton>
        </Flex>
      </Form>
    </Flex>
  );
};
