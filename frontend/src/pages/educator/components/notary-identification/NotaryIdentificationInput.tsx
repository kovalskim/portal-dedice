import { Box } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';

import { InfoHintBox } from '@frontend/components';
import { Link } from '@frontend/components/links';
import { useEducatorStorage } from '@frontend/hooks/useEducatorStorage.ts';
import {
  DeceasedPersonForm,
  DeceasedPersonFormFields,
} from '@frontend/pages/educator/components/notary-identification/DeceasedPersonForm.tsx';

type NotaryIdentificationInputProps = {
  onSubmit: SubmitHandler<DeceasedPersonFormFields>;
};

export const NotaryIdentificationInput = ({
  onSubmit,
}: NotaryIdentificationInputProps) => {
  const { storage } = useEducatorStorage();

  const defaultFormData = storage.deceasedPersonFormData;

  return (
    <>
      <Box mb="6">
        <InfoHintBox title="Jak probíhá výběr notáře pověřeného vedením dědického řízení?">
          Pověření konkrétního notáře vedením dědického řízení probíhá na
          základě tzv.&nbsp;
          <Link
            isInsideInfoHintBox={true}
            href="https://www.nkcr.cz/seznam-notaru/rozvrhy-rizeni-o-pozustalosti"
            isExternal
          >
            rozvrhu práce
          </Link>
          . Přiřazení závisí na vybraných údajích o zůstaviteli.
        </InfoHintBox>
      </Box>
      <Heading size="sm" mb="6" textAlign="center">
        Zadejte údaje o zůstaviteli (zemřelé osobě)
      </Heading>
      <DeceasedPersonForm
        loadDefaultFrom={defaultFormData}
        id="deceasedPersonForm"
        onSubmit={(data) => onSubmit(data)}
      />
    </>
  );
};
