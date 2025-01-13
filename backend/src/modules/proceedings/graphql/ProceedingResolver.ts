import {
  Arg,
  Args,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { GetAllProceedingsArgs } from '@backend/modules/proceedings/graphql/types/GetAllProceedingsArgs';
import { NewProceedingInput } from '@backend/modules/proceedings/graphql/types/NewProceedingInput';
import {
  PaginatedProceedings,
  Proceeding,
} from '@backend/modules/proceedings/graphql/types/proceedingType';
import { UpdateProceedingInput } from '@backend/modules/proceedings/graphql/types/UpdateProceedingInput';
import { User } from '@backend/modules/users/graphql/types/userType';
import { CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => Proceeding)
export class ProceedingResolver {
  @FieldResolver(() => User)
  async notary(
    @Root() proceeding: Proceeding,
    @Ctx() { userService }: CustomContext,
  ): Promise<User> {
    return userService.getUserById(proceeding.notaryId);
  }

  @Query(() => Proceeding, { nullable: true })
  @Authenticated()
  async getProceeding(
    @Arg('id') id: number,
    @Ctx() { authUser, proceedingService }: AuthenticatedContext,
  ): Promise<Proceeding | null> {
    return await proceedingService.getProceeding(authUser.id, id);
  }

  @Query(() => PaginatedProceedings)
  @Authenticated()
  async getAllProceedings(
    @Ctx()
    { authUser, proceedingService }: AuthenticatedContext,
    @Args() args: GetAllProceedingsArgs,
  ): Promise<PaginatedProceedings> {
    return await proceedingService.findAllProceedings(authUser.id, args);
  }

  @FieldResolver(() => Boolean)
  @Authenticated()
  async isLoggedUserApprovedParticipantOrNotary(
    @Root() proceeding: Proceeding,
    @Ctx() { authUser, participantValidationService }: CustomContext,
  ): Promise<boolean> {
    return await participantValidationService.isUserParticipantOrNotaryOfProceeding(
      authUser!.id,
      proceeding.id,
    );
  }

  @Mutation(() => Proceeding)
  @Authenticated()
  async createProceeding(
    @Arg('data') input: NewProceedingInput,
    @Ctx()
    { authUser, proceedingService }: AuthenticatedContext,
  ): Promise<Proceeding> {
    return await proceedingService.createNewProceeding(authUser.id, input);
  }

  @Mutation(() => Proceeding)
  @Authenticated()
  async updateProceeding(
    @Arg('id') id: number,
    @Arg('data') input: UpdateProceedingInput,
    @Ctx() { authUser, proceedingService }: AuthenticatedContext,
  ): Promise<Proceeding> {
    return await proceedingService.updateProceeding(authUser.id, id, input);
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async deleteProceeding(
    @Arg('id') id: number,
    @Ctx()
    { authUser, proceedingService }: AuthenticatedContext,
  ): Promise<boolean> {
    return await proceedingService.deleteProceeding(authUser.id, id);
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async updateProceedingPhase(
    @Arg('proceedingId') proceedingId: number,
    @Arg('phaseId') phaseId: number,
    @Ctx()
    { authUser, proceedingService }: AuthenticatedContext,
  ): Promise<boolean> {
    return await proceedingService.updateProceedingPhase(
      authUser.id,
      proceedingId,
      phaseId,
    );
  }
}
