import { GraphQLError } from 'graphql';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';

import {
  unauthenticatedError,
  unauthorizedError,
} from '@backend/graphql/errors';
import {
  PaginatedProceedings,
  Proceeding,
} from '@backend/graphql/modules/proceedings/create/proceedingType';
import { Participant } from '@backend/graphql/modules/proceedings/participantType';
import { UserRole } from '@backend/graphql/modules/user/roleType';
import { User } from '@backend/graphql/modules/user/userType';
import { CustomContext } from '@backend/types/types';

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
  async getProceeding(
    @Arg('id') id: number,
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<Proceeding | null> {
    if (!authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

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
  async getAllProceedings(
    @Ctx()
    { authUser, proceedingsRepository, usersRepository }: CustomContext,
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
    if (!authUser) {
      throw unauthorizedError('Unauthorized to get all proceedings');
    }

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
  async proceedingParticipants(
    @Arg('id') proceedingId: number,
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<Participant[]> {
    if (!authUser) {
      throw unauthenticatedError('Unauthorized');
    }

    return await proceedingsRepository.getProceedingParticipants(proceedingId);
  }
}
