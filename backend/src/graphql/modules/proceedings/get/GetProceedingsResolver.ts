import { GraphQLError } from 'graphql';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';

import { CustomContext } from '@backend/types/types';

import { Proceedings } from '../create/proceedingsType';

@Resolver(() => Proceedings)
export class GetProceedingsResolver {
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
}
