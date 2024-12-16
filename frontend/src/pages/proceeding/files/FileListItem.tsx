import React, { FC, useState } from 'react';
import { Box } from '@chakra-ui/layout';
import { Button, Icon, Link, Spacer, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import {
  FaExternalLinkAlt,
  FaFilePdf,
  FaFileWord,
  FaTrashAlt,
} from 'react-icons/fa';

import { File } from '@frontend/gql/file/types.ts';
import { DeleteFileModal } from '@frontend/pages/proceeding/files/DeleteFileModal.tsx';

interface FileListItemProps {
  file: File;
}

export const FileListItem: FC<FileListItemProps> = ({ file }) => {
  function getFileIcon(type: 'pdf' | 'docx') {
    switch (type) {
      case 'pdf':
        return <FaFilePdf />;
      case 'docx':
        return <FaFileWord />;
      default:
        return <Icon />;
    }
  }

  const [deleteFileModalOpen, setDeleteFileModalOpen] = useState(false);

  return (
    <Box
      bg="gray.100"
      p={4}
      my={2}
      borderRadius="md"
      _hover={{ bg: 'gray.200' }}
      role="group"
    >
      <Stack direction="row" align="center">
        <Link
          href={file.path}
          isExternal={true}
          target="_blank"
          display="flex"
          alignItems="center"
          ml={3}
        >
          {getFileIcon(file.type)}
          <Text fontWeight="bold" isTruncated maxWidth="200px" ml={2}>
            {file.alias}
          </Text>
          <Icon as={FaExternalLinkAlt} ml={1} color="gray.500" boxSize={3} />
        </Link>

        <Spacer />

        <Box textAlign="right">
          <Text fontSize="sm" color="gray.500">
            {`${file.user.beforeTitle ?? ''} ${file.user.firstname} ${file.user.lastname} ${file.user.afterTitle ?? ''}`}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {format(file.timestamp, 'dd. MM. yyyy HH:mm')}
          </Text>
        </Box>

        <Button
          size="sm"
          colorScheme="red"
          onClick={() => setDeleteFileModalOpen(true)}
          variant="ghost"
          opacity={0}
          _groupHover={{ opacity: 1 }}
          ml={4}
        >
          <FaTrashAlt />
        </Button>
      </Stack>

      <DeleteFileModal
        isOpen={deleteFileModalOpen}
        onClose={() => setDeleteFileModalOpen(false)}
        fileId={file.id}
      />
    </Box>
  );
};
