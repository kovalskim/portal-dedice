import { GraphQLError } from 'graphql';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';

import { unauthenticatedError } from '@backend/graphql/errors';
import { Participant } from '@backend/graphql/modules/proceedings/participantType';
import { User } from '@backend/graphql/modules/user/userType';
import { CustomContext } from '@backend/types/types';

import { Proceedings } from '../create/proceedingsType';

@Resolver(() => Proceedings)
export class GetProceedingsResolver {
  @FieldResolver(() => User)
  async notary(
    @Root() proceeding: Proceedings,
    @Ctx() { usersRepository }: CustomContext,
  ): Promise<User> {
    return usersRepository.getUserById(proceeding.notaryId);
  }

  @Query(() => Proceedings, { nullable: true })
  async getProceeding(
    @Arg('id') id: number,
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<Proceedings | null> {
    if (!authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const proceedings = await proceedingsRepository.getProceedingsById(id);

    if (!proceedings) {
      throw new GraphQLError('Proceedings not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    return {
      ...proceedings,
      deceasedDateOfDeath: proceedings.deceasedDateOfDeath.toISOString(),
      deceasedDateOfBirth: proceedings.deceasedDateOfBirth.toISOString(),
      startDate: proceedings.startDate.toISOString(),
    };
  }

  @Query(() => [Proceedings])
  async getAllProceedings(
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<Proceedings[]> {
    if (!authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const allProceedings = await proceedingsRepository.getAllProceedings();

    return allProceedings.map((proceeding) => ({
      ...proceeding,
      deceasedDateOfDeath: proceeding.deceasedDateOfDeath.toISOString(),
      deceasedDateOfBirth: proceeding.deceasedDateOfBirth.toISOString(),
      startDate: proceeding.startDate.toISOString(),
    }));
  }

  @Query(() => [Participant])
  async proceedingParticipants(
    @Arg('id') proceedingId: number,
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<Participant[]> {
    if (!authUser) {
      unauthenticatedError('Unauthorized');
    }

    return await proceedingsRepository.getProceedingParticipants(proceedingId);
  }
}
