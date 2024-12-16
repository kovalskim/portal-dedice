import { FC } from 'react';
import { Card, Flex, Text } from '@chakra-ui/react';

import { Message as MessageType } from '@frontend/gql/chat/types';
import { formatDatetime } from '@frontend/utils/util.tsx';

interface MessageProps {
  message: MessageType;
  myMessage: boolean;
}

export const Message: FC<MessageProps> = ({ message, myMessage }) => {
  return (
    <Card
      backgroundColor={myMessage ? 'goldenYellow.50' : 'lightGray.100'}
      alignSelf={myMessage ? 'flex-end' : 'flex-start'}
      padding={4}
      borderRadius={16}
      maxW={{ base: '80%', md: '70%' }}
    >
      <Flex
        justifyContent={myMessage ? 'flex-end' : 'flex-start'}
        flexDirection={'row'}
        gap={8}
      >
        <Text fontSize={'small'} color={'gray'}>
          {message.user.firstname} {message.user.lastname}
        </Text>
        <Text fontSize={'small'} color={'gray'}>
          {formatDatetime(message.timestamp)}
        </Text>
      </Flex>
      <Text>{message.text}</Text>
    </Card>
  );
};
