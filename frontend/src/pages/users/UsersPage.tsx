import { useEffect, useState } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { Role, useAuth } from '@frontend/context/auth/auth-core.tsx';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { InviteUserModal } from '@frontend/pages/users/components/InviteUserModal.tsx';
import { Routes } from '@frontend/routes/routes.ts';

export const UsersPage = () => {
  const { role } = useAuth();
  const showToast = useCustomToast();
  const navigate = useNavigate();

  const [newUserModalOpen, setNewUserModalOpen] = useState(false);

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
      <InviteUserModal
        isOpen={newUserModalOpen}
        onClose={() => setNewUserModalOpen(false)}
      />
    </Flex>
  );
};
