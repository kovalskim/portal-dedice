import { Heading, ListItem, Stack, UnorderedList } from '@chakra-ui/react';

import { InfoHintBox } from '@frontend/components/infoHintBox/InfoHintBox';
import {
  Result,
  useEducatorStorage,
} from '@frontend/pages/educator/hooks/useEducatorStorage.ts';

type ResolutionOfInheritanceProps = {
  result?: Result;
};

export const ResolutionOfInheritance = ({
  result,
}: ResolutionOfInheritanceProps) => {
  const { storage } = useEducatorStorage();

  if (!result) {
    return (
      <Stack spacing={10}>
        <Heading textAlign={'center'} size={'sm'}>
          Omlouváme se, ale tuto variantu nejsme schopni zpracovat.
        </Heading>
        {storage.hadWill && (
          <InfoHintBox title="Proč není možné zpracovat variantu se sepsanou závětí?">
            Pozůstalostní řízení v případě sepsání závěti je specifická
            záležitost, kterou je třeba řešit přímo s notářem.
          </InfoHintBox>
        )}
      </Stack>
    );
  }

  return (
    <Stack spacing={10}>
      <Heading textAlign={'center'} size={'sm'}>
        {result.title}
      </Heading>
      {result.explanations && result.explanations.length > 0 && (
        <UnorderedList spacing={6}>
          {result.explanations.map((val) => (
            <ListItem key={val}>{val}</ListItem>
          ))}
        </UnorderedList>
      )}
    </Stack>
  );
};
