import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { File } from '@backend/modules/files/graphql/types/fileType';
import { SignedUrl } from '@backend/modules/files/graphql/types/signedUrlType';
import { User } from '@backend/modules/users/graphql/types/userType';
import { CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => File)
export class FileResolver {
  @FieldResolver(() => User)
  async user(
    @Root() file: File,
    @Ctx() { userService }: CustomContext,
  ): Promise<User> {
    return userService.getUserById(file.userId);
  }

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
