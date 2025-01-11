import { Flex } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';

import { PrimaryButton, SecondaryButton } from '@frontend/components/buttons';

type AssetsActionsProps = {
  loading: boolean;
};

export const AssetsActions = ({ loading }: AssetsActionsProps) => {
  const methods = useFormContext();

  return (
    <Flex
      justifyContent="center"
      gap={2}
      borderTop="1px solid"
      borderTopColor="gray.500"
      pt={6}
    >
      <PrimaryButton isLoading={loading} type="submit">
        Uložit změny
      </PrimaryButton>
      <SecondaryButton onClick={() => methods.reset()}>
        Zahodit změny
      </SecondaryButton>
    </Flex>
  );
};
