import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import { Heading, Text } from '@chakra-ui/react';
import { SubmitHandler } from 'react-hook-form';

import { InfoHintBox } from '@frontend/components';
import { Link } from '@frontend/components/links';
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
  return (
    <Box>
      <Box mb="6">
        <InfoHintBox title="Jak probíhá výběr notáře pověřeného vedením dědického řízení?">
          <Text>
            Pověření konkrétního notáře vedením dědického řízení probíhá na
            základě tzv.&nbsp;
            <Link
              href="https://www.nkcr.cz/seznam-notaru/rozvrhy-rizeni-o-pozustalosti"
              isExternal
            >
              rozvrhu práce
              <ExternalLinkIcon mx="2px" mb="4px" />
            </Link>
            . Přiřazení závisí na vybraných údajích o zůstaviteli.
          </Text>
        </InfoHintBox>
      </Box>
      <Heading size="sm" mb="6" textAlign="center">
        Zadejte údaje o zůstaviteli (zemřelé osobě)
      </Heading>
      <DeceasedPersonForm
        id="deceasedPersonForm"
        onSubmit={(data) => onSubmit(data)}
      />
    </Box>
  );
};
