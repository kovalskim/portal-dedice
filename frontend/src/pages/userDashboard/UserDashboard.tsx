import { useEffect, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Card, Flex, Heading, Text } from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components/buttons';
import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import { InvitationModal } from '@frontend/pages/userDashboard/components/InvitationModal.tsx';
import { DeleteProceedingsModal } from '@frontend/pages/userDashboard/components/proceedingsModals/DeleteProceedingsModal.tsx';
import { EditProceedingsModal } from '@frontend/pages/userDashboard/components/proceedingsModals/EditProceedingsModal.tsx';
import { useNewProceedingFormStore } from '@frontend/pages/userDashboard/hooks/useNewProceedingFormStore.ts';
import { firstNameInVokativ } from '@frontend/utils/languageUtils.ts';

import { NewProceedingsModal } from './components/proceedingsModals/NewProceedingsModal';
import ProceedingsTable from './components/proceedingsTable/ProceedingsTable';

export const UserDashboard = () => {
  const [newProceedingsModalOpen, setNewProceedingsModalOpen] = useState(false);
  const { user, role } = useAuth();
  const [editProceedingsModalOpen, setEditProceedingsModalOpen] =
    useState(false);
  const [deleteProceedingsModalOpen, setDeleteProceedingsModalOpen] =
    useState(false);
  const [selectedProceeding, setSelectedProceeding] = useState<{
    id: number;
    data?: DeceasedPersonFormFields;
  } | null>(null);

  const { resetFormStore } = useNewProceedingFormStore();

  const handleEditProceeding = (id: number, data: DeceasedPersonFormFields) => {
    setSelectedProceeding({ id, data });
    setEditProceedingsModalOpen(true);
  };

  const handleDeleteProceeding = (id: number) => {
    setSelectedProceeding({ id });
    setDeleteProceedingsModalOpen(true);
  };

  // reseting formstore and states on closing modals
  useEffect(() => {
    if (!newProceedingsModalOpen) {
      resetFormStore();
    }
    if (!(editProceedingsModalOpen || deleteProceedingsModalOpen)) {
      setSelectedProceeding(null);
    }
  }, [
    resetFormStore,
    newProceedingsModalOpen,
    editProceedingsModalOpen,
    deleteProceedingsModalOpen,
  ]);

  const handleCloseModal = () => {
    setNewProceedingsModalOpen(false);
  };

  return (
    <Flex direction="column" gap={4} py={{ sm: 2, lg: 4 }}>
      <Heading as="h2" size="lg">
        Vítejte na Portálu dědice, {firstNameInVokativ(user?.firstname)}!
      </Heading>
      <Text>
        Portál dědice je vaším průvodcem dědickým řízením, který slouží jako
        digitální podpora celého procesu propojující notáře a ostatní účastníky
        řízení a jako komunikační nástroj s přiděleným notářem.
      </Text>
      {role === Role.NOTARY && (
        <Flex justifyContent="flex-end" mt={4}>
          <PrimaryButton
            leftIcon={<AddIcon />}
            onClick={() => setNewProceedingsModalOpen(true)}
          >
            Nové řízení
          </PrimaryButton>
        </Flex>
      )}

      <Card>
        <ProceedingsTable
          onEditProceeding={handleEditProceeding}
          onDeleteProceeding={handleDeleteProceeding}
        />
      </Card>

      <NewProceedingsModal
        isOpen={newProceedingsModalOpen}
        onClose={handleCloseModal}
      />
      {selectedProceeding !== null && (
        <>
          <EditProceedingsModal
            isOpen={editProceedingsModalOpen}
            onClose={() => setEditProceedingsModalOpen(false)}
            proceedingId={selectedProceeding?.id}
            initialData={selectedProceeding?.data}
          />
          <DeleteProceedingsModal
            isOpen={deleteProceedingsModalOpen}
            onClose={() => setDeleteProceedingsModalOpen(false)}
            proceedingId={selectedProceeding?.id}
          />
        </>
      )}

      <InvitationModal />
    </Flex>
  );
};
