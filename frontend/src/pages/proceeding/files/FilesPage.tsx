import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { Box } from '@chakra-ui/layout';
import {
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { PiUploadSimple } from 'react-icons/pi';
import { useOutletContext } from 'react-router-dom';

import { InfoHintBox, PrimaryButton } from '@frontend/components';
import { FILES_BY_PROCEEDING_ID } from '@frontend/gql/file/queries.ts';
import { File } from '@frontend/gql/file/types.ts';
import { useCustomToast } from '@frontend/hooks/useCustomToast.ts';
import { OutletContextType } from '@frontend/pages';
import { FileList } from '@frontend/pages/proceeding/files/FileList.tsx';
import { UploadFileModal } from '@frontend/pages/proceeding/files/UploadFileModal.tsx';
import { MAX_FILES } from '@frontend/utils/constants';

interface FilesData {
  filesByProceeding: File[];
}

export const FilesPage = () => {
  const { proceeding } = useOutletContext<OutletContextType>();
  const proceedingId = proceeding.id;

  const showToast = useCustomToast();

  const [openUploadFileModal, setOpenUploadFileModal] = useState(false);

  const { data, loading, error, refetch } = useQuery<FilesData>(
    FILES_BY_PROCEEDING_ID,
    {
      variables: { proceedingId: Number(proceedingId) },
    },
  );

  const fileCount = data?.filesByProceeding.length || 0;
  const isUploadDisabled = fileCount >= MAX_FILES;

  useEffect(() => {
    if (error) {
      showToast({
        title: 'Nepodařilo se načíst soubory',
        description: 'Při načítání souborů dědického řízení se vyskytla chyba.',
        status: 'error',
      });
    }
  }, [error, showToast]);

  const handleFileUploadSuccess = () => {
    refetch();
    setOpenUploadFileModal(false);
    showToast({
      title: 'Soubor nahrán',
      description: 'Soubor byl úspěšně nahrán.',
      status: 'success',
    });
  };

  return (
    <Box mt={2}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ base: 'flex-start', md: 'center' }}
        mb={2}
      >
        <Heading size="md" mb={{ base: 2, md: 0 }}>
          Seznam souborů
        </Heading>
        <PrimaryButton
          leftIcon={<PiUploadSimple />}
          onClick={() => setOpenUploadFileModal(true)}
          isDisabled={isUploadDisabled}
        >
          Nahrát soubor
        </PrimaryButton>
      </Flex>
      {isUploadDisabled && (
        <Text mb={4} color="red.500" fontSize="sm" align="right">
          Maximální počet souborů pro nahrání je {MAX_FILES}.
        </Text>
      )}

      <InfoHintBox title="Pro zrychlení dědického řízení pomůže, když notáři doložíte tyto dokumenty:">
        <List>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="goldenYellow.600" />
            Oddací list{' '}
            <small>(pokud v době úmrtí byl zůstavitel v manželství)</small>
          </ListItem>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="goldenYellow.600" />
            Rodné listy potomků <small>(pokud měl zůstavitel potomky)</small>
          </ListItem>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="goldenYellow.600" />
            Odhad nemovitosti zpracovaný libovolnou realitní kanceláří{' '}
            <small>(pokud v SJM nebo pozůstalosti figuruje nemovitost)</small>
          </ListItem>
        </List>
      </InfoHintBox>

      {loading && (
        <Flex justifyContent="center" mt={6}>
          <Spinner size="xl" color="goldenYellow.500" />
        </Flex>
      )}

      {data && (
        <FileList files={data?.filesByProceeding ?? []} onDelete={refetch} />
      )}

      <UploadFileModal
        isOpen={openUploadFileModal}
        onClose={() => setOpenUploadFileModal(false)}
        onSuccess={handleFileUploadSuccess}
        proceedingId={proceedingId}
      />
    </Box>
  );
};
