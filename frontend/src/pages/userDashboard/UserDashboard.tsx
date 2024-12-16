import { useEffect, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { Card, Flex, Heading, Text } from '@chakra-ui/react';

import { PrimaryButton } from '@frontend/components/buttons';
import { DeceasedPersonFormFields } from '@frontend/components/forms/deceasedPersonForm/DeceasedPersonForm.tsx';
import { Role, useAuth } from '@frontend/context/auth/auth-core';
import { InvitationModal } from '@frontend/pages/userDashboard/components/InvitationModal.tsx';
import { DeleteProceedingModal } from '@frontend/pages/userDashboard/components/proceedingModals/DeleteProceedingModal';
import { EditProceedingModal } from '@frontend/pages/userDashboard/components/proceedingModals/EditProceedingModal';
import { useNewProceedingFormStore } from '@frontend/pages/userDashboard/hooks/useNewProceedingFormStore.ts';
import { toVocative } from '@shared/utils/languageUtils.ts';

import { NewProceedingModal } from './components/proceedingModals/NewProceedingModal';
import ProceedingsTable from './components/proceedingsTable/ProceedingsTable';

export const UserDashboard = () => {
  const [newProceedingModalOpen, setNewProceedingModalOpen] = useState(false);
  const { user, role } = useAuth();
  const [editProceedingModalOpen, setEditProceedingModalOpen] = useState(false);
  const [deleteProceedingModalOpen, setDeleteProceedingModalOpen] =
    useState(false);
  const [selectedProceeding, setSelectedProceeding] = useState<{
    id: number;
    data?: DeceasedPersonFormFields;
  } | null>(null);

  const { resetFormStore } = useNewProceedingFormStore();

  const handleEditProceeding = (id: number, data: DeceasedPersonFormFields) => {
    setSelectedProceeding({ id, data });
    setEditProceedingModalOpen(true);
  };

  const handleDeleteProceeding = (id: number) => {
    setSelectedProceeding({ id });
    setDeleteProceedingModalOpen(true);
  };

  useEffect(() => {
    if (!newProceedingModalOpen) {
      resetFormStore();
    }
    if (!(editProceedingModalOpen || deleteProceedingModalOpen)) {
      setSelectedProceeding(null);
    }
  }, [
    resetFormStore,
    newProceedingModalOpen,
    editProceedingModalOpen,
    deleteProceedingModalOpen,
  ]);

  const handleCloseModal = () => {
    setNewProceedingModalOpen(false);
  };

  return (
    <Flex direction="column" gap={4} py={{ sm: 2, lg: 4 }}>
      <Heading as="h2" size="lg">
        Vítejte na Portálu dědice, {toVocative(user?.firstname)}!
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
            onClick={() => setNewProceedingModalOpen(true)}
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

      <NewProceedingModal
        isOpen={newProceedingModalOpen}
        onClose={handleCloseModal}
      />
      {selectedProceeding !== null && (
        <>
          <EditProceedingModal
            isOpen={editProceedingModalOpen}
            onClose={() => setEditProceedingModalOpen(false)}
            proceedingId={selectedProceeding?.id}
            initialData={selectedProceeding?.data}
          />
          <DeleteProceedingModal
            isOpen={deleteProceedingModalOpen}
            onClose={() => setDeleteProceedingModalOpen(false)}
            proceedingId={selectedProceeding?.id}
          />
        </>
      )}

      <InvitationModal />
    </Flex>
  );
};
