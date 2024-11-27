import { GraphQLError } from 'graphql';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';

import { unauthorizedError } from '@backend/errors/graphqlErrors';
import {
  PaginatedProceedings,
  Proceeding,
} from '@backend/graphql/modules/proceedings/create/proceedingType';
import { Participant } from '@backend/graphql/modules/proceedings/participantType';
import { UserRole } from '@backend/graphql/modules/user/roleType';
import { User } from '@backend/graphql/modules/user/userType';
import { CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => Proceeding)
export class GetProceedingsResolver {
  @FieldResolver(() => User)
  async notary(
    @Root() proceeding: Proceeding,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<User> {
    return usersRepository.getUserById(proceeding.notaryId);
  }

  @Query(() => Proceeding, { nullable: true })
  @Authenticated()
  async getProceeding(
    @Arg('id') id: number,
    @Ctx() { authUser, proceedingsRepository }: AuthenticatedContext,
  ): Promise<Proceeding | null> {
    if (
      !(
        (await proceedingsRepository.isUserParticipantInProceeding(
          authUser.id,
          id,
        )) ||
        (await proceedingsRepository.isUserNotaryInProceeding(authUser.id, id))
      )
    ) {
      throw unauthorizedError('Unauthorized to access the proceeding detail');
    }

    const proceeding = await proceedingsRepository.getProceedingById(id);

    if (!proceeding) {
      throw new GraphQLError('Proceedings not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    return {
      ...proceeding,
    };
  }

  @Query(() => PaginatedProceedings)
  @Authenticated()
  async getAllProceedings(
    @Ctx()
    { authUser, proceedingsRepository, usersRepository }: AuthenticatedContext,
    @Arg('currentPage', { defaultValue: 1 }) currentPage: number,
    @Arg('pageSize', { defaultValue: 2 }) pageSize: number,
    @Arg('sortOrder', { defaultValue: 'desc' }) sortOrder: 'asc' | 'desc',
    @Arg('filterProceedingNumber', { nullable: true })
    filterProceedingNumber?: string,
    @Arg('filterDeceasedName', { nullable: true }) filterDeceasedName?: string,
    @Arg('filterStartDate', { nullable: true })
    filterStartDate?: string,
    @Arg('filterPhaseId', { nullable: true }) filterPhaseId?: number,
    @Arg('filterStatus', { nullable: true }) filterStatus?: string,
  ): Promise<PaginatedProceedings> {
    const authUserRole = await usersRepository.getUserRole(authUser.id);
    const allProceedings =
      authUserRole?.name === UserRole.NOTARY
        ? await proceedingsRepository.getAllProceedingsByNotaryId(
            authUser.id,
            currentPage,
            pageSize,
            sortOrder,
            filterProceedingNumber,
            filterDeceasedName,
            filterStartDate,
            filterPhaseId,
            filterStatus,
          )
        : await proceedingsRepository.getAllProceedingsByParticipantId(
            authUser.id,
            currentPage,
            pageSize,
            sortOrder,
            filterProceedingNumber,
            filterDeceasedName,
            filterStartDate,
            filterPhaseId,
            filterStatus,
          );

    return {
      data: allProceedings.data.map((proceeding) => ({
        ...proceeding,
        deceasedDateOfDeath: proceeding.deceasedDateOfDeath,
        deceasedDateOfBirth: proceeding.deceasedDateOfBirth,
        startDate: proceeding.startDate,
      })),
      total: allProceedings.total,
    };
  }

  @Query(() => [Participant])
  @Authenticated()
  async proceedingParticipants(
    @Arg('id') proceedingId: number,
    @Ctx() { proceedingsRepository }: AuthenticatedContext,
  ): Promise<Participant[]> {
    return await proceedingsRepository.getProceedingParticipants(proceedingId);
  }
}
