import { ReactNode } from 'react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useOutletContext } from 'react-router-dom';

import { PROCEEDING_PHASES } from '@frontend/pages/proceeding/constants.ts';
import { OutletContextType } from '@frontend/pages/proceeding/overview/ProceedingOverviewPage.tsx';

type AssetListProps = {
  heading: string;
  placeholder?: string;
  nameOfArray: string;
  empty: Object;
  children: (index: number) => ReactNode;
};

export const AssetList = ({
  heading,
  placeholder = 'Zatím nebyli přidány žádné',
  nameOfArray,
  children,
  empty,
}: AssetListProps) => {
  const methods = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: nameOfArray,
  });
  const { proceeding } = useOutletContext<OutletContextType>();

  return (
    <>
      <Heading size="sm" mb={{ base: 2, md: 0 }} color="gray.700">
        {heading}
      </Heading>
      <Flex direction={'column'} justifyContent="center">
        {fields.length === 0 ? (
          <Box p={2} textAlign="center" color="gray.600">
            {placeholder}
          </Box>
        ) : (
          fields.map((bank, index) => (
            <Flex
              direction="column"
              justifyContent="center"
              my={3}
              gap={2}
              key={bank.id}
            >
              <Box bg="gray.50" py={3} px={4} borderRadius="md" role="group">
                <Stack
                  direction="row"
                  alignItems="start"
                  justifyContent="space-between"
                >
                  {children(index)}
                  {proceeding.phaseId !== PROCEEDING_PHASES.FINISHED && (
                    <Box>
                      <Button
                        color="red.400"
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Flex>
          ))
        )}
        {proceeding.phaseId !== PROCEEDING_PHASES.FINISHED && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              append(empty);
            }}
            color="green.500"
          >
            <AddIcon />
          </Button>
        )}
      </Flex>
    </>
  );
};
