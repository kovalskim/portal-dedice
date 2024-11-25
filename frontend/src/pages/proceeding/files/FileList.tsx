import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';

import { File } from '@frontend/gql/file/types.ts';
import { FileListItem } from '@frontend/pages/proceeding/files/FileListItem.tsx';

interface FileListProps {
  files: File[];
  onDelete: () => void;
}

export const FileList: FC<FileListProps> = ({ files, onDelete }) => {
  return (
    <Box mt={4}>
      {files?.length > 0 ? (
        files.map((file) => (
          <FileListItem key={file.id} file={file} onDelete={onDelete} />
        ))
      ) : (
        <Text color="gray.500">Žádné soubory zatím nebyly nahrány</Text>
      )}
    </Box>
  );
};
