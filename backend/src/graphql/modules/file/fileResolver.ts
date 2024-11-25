import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import {
  notFoundError,
  serverError,
  unauthenticatedError,
  unauthorizedError,
} from '@backend/graphql/errors';
import { File } from '@backend/graphql/modules/file/fileType';
import { SignedUrl } from '@backend/graphql/modules/file/signedUrlType';
import {
  deleteFile,
  getFilePath,
  getUploadUrl,
} from '@backend/services/awsService/awsService';
import { CustomContext } from '@backend/types/types';

@Resolver(() => File)
export class FileResolver {
  @Query(() => [File])
  async filesByProceeding(
    @Arg('proceedingId') proceedingId: number,
    @Ctx()
    { authUser, filesRepository, participantValidationService }: CustomContext,
  ): Promise<File[]> {
    if (!authUser) {
      throw unauthenticatedError('Unauthenticated');
    }

    if (
      !(await participantValidationService.isUserParticipantOrNotaryOfProceeding(
        authUser.id,
        proceedingId,
      ))
    ) {
      throw unauthorizedError('User is not a participant in this proceeding');
    }

    const files = await filesRepository.findFilesByProceedingId(proceedingId);

    return Promise.all(
      files.map((f) =>
        getFilePath(`${f.proceedingId}/${f.path}`).then((path) => ({
          ...f,
          path,
        })),
      ),
    );
  }

  @Mutation(() => String)
  async deleteFile(
    @Arg('id') stringId: string,
    @Ctx()
    { authUser, filesRepository, participantValidationService }: CustomContext,
  ): Promise<string> {
    if (!authUser) {
      throw unauthenticatedError('Unauthenticated');
    }

    const id = parseInt(stringId, 10);

    const file = await filesRepository.getFileById(id);

    if (
      !(await participantValidationService.isUserParticipantOrNotaryOfProceeding(
        authUser.id,
        file.proceedingId,
      ))
    ) {
      throw unauthorizedError('User is not a participant in this proceeding');
    }

    if (!file) {
      throw notFoundError('File not found');
    }

    try {
      await filesRepository.deleteFile(id);
    } catch (error) {
      throw serverError(`Failed to delete file`);
    }

    try {
      await deleteFile(`${file.proceedingId}/${file.path}`);
    } catch (error) {
      throw serverError(`Failed to delete file from storage`);
    }

    return 'File was deleted';
  }

  @Mutation(() => SignedUrl)
  async getSignedUrl(
    @Arg('proceedingId') proceedingStringId: string,
    @Arg('filename') filename: string,
    @Arg('filetype') filetype: string,
    @Ctx() { authUser, participantValidationService }: CustomContext,
  ): Promise<SignedUrl> {
    if (!authUser) {
      throw unauthenticatedError('Unauthenticated');
    }
    const proceedingId = parseInt(proceedingStringId, 10);

    if (
      !(await participantValidationService.isUserParticipantOrNotaryOfProceeding(
        authUser.id,
        proceedingId,
      ))
    ) {
      throw unauthorizedError('User is not a participant in this proceeding');
    }

    const key = `${proceedingId}/${filename}`;

    const url = await getUploadUrl(key, filetype);
    return { url };
  }

  @Mutation(() => String)
  async saveFile(
    @Arg('key') key: string,
    @Arg('alias') alias: string,
    @Arg('proceedingId') proceedingStringId: string,
    @Arg('type') type: string,
    @Ctx()
    { authUser, filesRepository, participantValidationService }: CustomContext,
  ): Promise<string> {
    if (!authUser) {
      throw unauthenticatedError('Unauthenticated');
    }

    const proceedingId = parseInt(proceedingStringId, 10);

    if (
      !(await participantValidationService.isUserParticipantOrNotaryOfProceeding(
        authUser.id,
        proceedingId,
      ))
    ) {
      throw unauthorizedError('User is not a participant in this proceeding');
    }

    await filesRepository.saveFile(proceedingId, alias, type, authUser.id, key);

    return 'Successfully saved';
  }
}
