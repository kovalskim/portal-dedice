import { useEffect, useState } from 'react';
import { Card, Flex, Heading } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { Role, useAuth } from '@frontend/context/auth/auth-core.tsx';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { BanModal } from '@frontend/pages/users/components/BanModal.tsx';
import { InviteUserModal } from '@frontend/pages/users/components/InviteUserModal.tsx';
import UsersTable from '@frontend/pages/users/components/UsersTable.tsx';
import { Routes } from '@frontend/routes/routes.ts';

export const UsersPage = () => {
  const { role } = useAuth();
  const showToast = useCustomToast();
  const navigate = useNavigate();

  const [newUserModalOpen, setNewUserModalOpen] = useState(false);
  const [banModalOpenState, setBanModalOpenState] = useState<
    'close' | 'ban' | 'unban'
  >('close');
  const [selectedUserId, setSelectedUserId] = useState(0);

  const handleBanModalOpen = (
    userId: number,
    banModalOpenState: 'close' | 'ban' | 'unban',
  ) => {
    setSelectedUserId(userId);
    setBanModalOpenState(banModalOpenState);
  };
  useEffect(() => {
    if (role !== Role.ADMIN) {
      showToast({
        title: 'Nedostatečná oprávnění.',
        description: 'Pro přístup na stránku nemáte dostatečná oprávnění.',
        status: 'warning',
      });
      navigate(Routes.proceedings);
    }
  }, [navigate, role, showToast]);

  return (
    <Flex direction="column" gap={4} py={{ sm: 2, lg: 4 }}>
      <Heading size="lg">Správa uživatelů</Heading>
      <Flex justifyContent="flex-end" mt={4}>
        <PrimaryButton
          leftIcon={<FaUserPlus />}
          onClick={() => setNewUserModalOpen(true)}
        >
          Přidat uživatele
        </PrimaryButton>
      </Flex>
      <Card>
        <UsersTable setBanModalOpenState={handleBanModalOpen} />
      </Card>
      <InviteUserModal
        isOpen={newUserModalOpen}
        onClose={() => setNewUserModalOpen(false)}
      />
      <BanModal
        banModalOpenState={banModalOpenState}
        onClose={() => setBanModalOpenState('close')}
        userId={selectedUserId}
      />
    </Flex>
  );
};
