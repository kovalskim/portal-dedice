import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { File } from '@backend/graphql/modules/file/fileType';
import { SignedUrl } from '@backend/graphql/modules/file/signedUrlType';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => File)
export class FileResolver {
  @Query(() => [File])
  @Authenticated()
  async filesByProceeding(
    @Arg('proceedingId') proceedingId: number,
    @Ctx()
    { fileService }: AuthenticatedContext,
  ): Promise<File[]> {
    return fileService.findFilesByProceeding(proceedingId);
  }

  @Mutation(() => Boolean)
  async deleteFile(
    @Arg('id') stringId: string,
    @Ctx()
    { fileService }: AuthenticatedContext,
  ): Promise<boolean> {
    await fileService.deleteFile(stringId);
    return true;
  }

  @Mutation(() => SignedUrl)
  @Authenticated()
  async getSignedUrl(
    @Arg('proceedingId') proceedingStringId: string,
    @Arg('filename') filename: string,
    @Arg('filetype') filetype: string,
    @Ctx()
    { fileService }: AuthenticatedContext,
  ): Promise<SignedUrl> {
    const url = await fileService.getSignedUrl(
      proceedingStringId,
      filename,
      filetype,
    );
    return { url };
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async saveFile(
    @Arg('proceedingId') proceedingStringId: string,
    @Arg('alias') alias: string,
    @Arg('type') type: string,
    @Arg('key') key: string,
    @Ctx()
    { fileService }: AuthenticatedContext,
  ): Promise<boolean> {
    await fileService.saveFile(proceedingStringId, alias, type, key);
    return true;
  }
}
