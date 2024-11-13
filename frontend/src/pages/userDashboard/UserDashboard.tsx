import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Card, Flex, Heading, Text } from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components';
import { useAuth } from '@frontend/context/auth';
import { Role } from '@frontend/context/auth/auth-core';

import { NewProceedingsModal } from './components/newProceedingsModal/NewProceedingsModal';
import ProceedingsTable from './components/proceedingsTable/ProceedingsTable';

export const UserDashboard = () => {
  const [newProceedingsModalOpen, setNewProceedingsModalOpen] = useState(false);
  const { role } = useAuth();

  return (
    <Flex direction="column" gap={4} py={{ sm: 2, lg: 4 }}>
      <Flex direction="row" alignItems="center" gap={20}>
        <Heading as="h2" size="lg">
          Vítejte na Portálu dědice
        </Heading>
        {/* TODO pridať podmienku či je to notár <Text>Notářský modul</Text> */}
      </Flex>
      <Text>
        Portál dědice je vaším průvodcem dědickým řízením, který slouží jako
        digitální podpora celého procesu propojující notáře a ostatní účastníky
        řízení a jako komunikační nástroj s přiděleným notářem.
      </Text>
      {role === Role.NOTARY && (
        <Flex justifyContent="flex-end">
          <PrimaryButton
            leftIcon={<AddIcon />}
            onClick={() => setNewProceedingsModalOpen(true)}
          >
            Nové řízení
          </PrimaryButton>
        </Flex>
      )}

      <Card>
        <ProceedingsTable />
      </Card>

      <NewProceedingsModal
        isOpen={newProceedingsModalOpen}
        onClose={() => setNewProceedingsModalOpen(false)}
      />
    </Flex>
  );
};
