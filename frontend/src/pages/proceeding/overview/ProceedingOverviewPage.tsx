import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  CheckCircleIcon,
  InfoIcon,
  Tab,
  TabList,
  TabPanel,
} from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Select,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useOutletContext } from 'react-router-dom';

import { PrimaryButton } from '@frontend/components/buttons';
import { InfoHintBox } from '@frontend/components/infoHintBox/InfoHintBox';
import { Role, useAuth } from '@frontend/context/auth/auth-core.tsx';
import { UPDATE_PROCEEDING_PHASE } from '@frontend/gql/proceedings/mutations.ts';
import {
  GET_PROCEEDING_BY_ID,
  Proceeding,
} from '@frontend/gql/proceedings/queries.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import {
  PROCEEDING_PHASES,
  PROCEEDING_PHASES_TASKS,
} from '@frontend/pages/proceeding/constants.ts';

export type OutletContextType = { proceeding: Proceeding };

export const ProceedingOverviewPage = () => {
  const { proceeding } = useOutletContext<OutletContextType>();
  const [selectedPhase, setSelectedPhase] = useState<number | undefined>(
    proceeding.phaseId ?? 0,
  );
  const { role } = useAuth();
  const showToast = useCustomToast();

  const [updateProceedingPhase] = useMutation(UPDATE_PROCEEDING_PHASE, {
    refetchQueries: [GET_PROCEEDING_BY_ID],
    onError: () => {
      showToast({
        title: 'Při změně fáze dědického řízení nastala chyba.',
        description: 'Změna fáze dědického řízení proběhla neúspěšně.',
        status: 'error',
      });
    },
    onCompleted: () => {
      showToast({
        title: 'Změna fáze dědického řízení proběhla úspěšně.',
        description: 'Úspěšně jste změnili aktuální fázi dědického řízení.',
        status: 'success',
      });
    },
  });

  if (!proceeding || proceeding.phaseId === undefined) return null;
  const tasks = PROCEEDING_PHASES_TASKS[proceeding.phaseId - 1].tasks || [];

  const handlePhaseChange = async () => {
    await updateProceedingPhase({
      variables: {
        phaseId: Number(selectedPhase),
        proceedingId: Number(proceeding.id),
      },
    });
  };

  return (
    <>
      <Box>
        <Tabs
          key={proceeding.id}
          width="100%"
          colorScheme="goldenYellow"
          index={proceeding.phaseId ? proceeding.phaseId - 1 : 0}
        >
          {role === Role.NOTARY && (
            <Flex alignItems="center" mb={4} justifyContent="start">
              <Text mr={2} fontSize="sm">
                Aktuální fáze:
              </Text>
              <Select
                size="sm"
                value={selectedPhase?.toString()}
                onChange={(e) => setSelectedPhase(Number(e.target.value))}
                width="200px"
                mr={2}
              >
                {PROCEEDING_PHASES_TASKS.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.title}
                  </option>
                ))}
              </Select>
              <PrimaryButton onClick={handlePhaseChange} size="sm">
                Uložit
              </PrimaryButton>
            </Flex>
          )}
          <TabList>
            <Flex direction={{ base: 'column', md: 'row' }} width="full">
              {PROCEEDING_PHASES_TASKS.filter((phase) => phase.id < 4).map(
                (phase) => (
                  <Tab
                    key={phase.id}
                    flex={1}
                    isDisabled={proceeding.phaseId !== phase.id}
                  >
                    {proceeding?.phaseId! > phase.id && (
                      <CheckCircleIcon color="green" mr={4} />
                    )}
                    <Text>{phase.title}</Text>
                  </Tab>
                ),
              )}
            </Flex>
          </TabList>
          <TabPanels mt={2}>
            {PROCEEDING_PHASES_TASKS.filter((phase) => phase.id < 4).map(
              (phase) => (
                <TabPanel px={0} key={phase.id}>
                  <InfoHintBox title={phase.description.title}>
                    {phase.description.text}
                  </InfoHintBox>
                </TabPanel>
              ),
            )}
          </TabPanels>
        </Tabs>
      </Box>
      {proceeding.phaseId !== PROCEEDING_PHASES.FINISHED && (
        <Box my={6}>
          <Heading fontSize="lg" mb={4}>
            Co Vás čeká?
          </Heading>
          <Box>
            <List spacing={3}>
              {tasks.map((task, index) => (
                <ListItem
                  key={index}
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{
                    borderColor: 'goldenYellow.400',
                    bg: 'goldenYellow.50',
                  }}
                  display="flex"
                  alignItems="center"
                >
                  <InfoIcon color="goldenYellow.500" mr={3} />
                  <Text fontSize="md" fontWeight="medium">
                    {task.text}
                  </Text>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      )}
      {proceeding.phaseId === PROCEEDING_PHASES.FINISHED && (
        <Flex
          alignItems="center"
          justifyContent="center"
          direction="column"
          gap={6}
          my="auto"
        >
          <CheckCircleIcon color="goldenYellow.500" boxSize="20" />
          <Text fontSize="xl" fontWeight="medium">
            Dědické řízení bylo ukončeno
          </Text>
        </Flex>
      )}
    </>
  );
};
