import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';

import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

import { CreateAssetsAllInput } from './types/AssetsInput';
import { AssetsAll } from './types/AssetsType';

@Resolver(() => AssetsAll)
export class AssetsResolver {
  @Query(() => AssetsAll, { nullable: true })
  @Authenticated()
  async getAssetById(
    @Arg('proceedingId', () => Int) proceedingId: number,
    @Ctx() { authUser, assetsService }: AuthenticatedContext,
  ): Promise<AssetsAll | null> {
    return await assetsService.findAssets(authUser.id, proceedingId);
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async createOrUpdateAsset(
    @Arg('data') data: CreateAssetsAllInput,
    @Arg('proceedingId', () => Int) proceedingId: number,
    @Ctx() { authUser, assetsService }: AuthenticatedContext,
  ): Promise<boolean> {
    return await assetsService.createOrUpdateAssets(
      authUser.id,
      proceedingId,
      data,
    );
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async deleteAsset(
    @Arg('proceedingId', () => Int) proceedingId: number,
    @Ctx() { authUser, assetsService }: AuthenticatedContext,
  ): Promise<boolean> {
    return await assetsService.deleteAssets(authUser.id, proceedingId);
  }
}
