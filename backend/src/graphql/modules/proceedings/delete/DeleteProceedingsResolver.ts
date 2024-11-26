import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { unauthorizedError } from '@backend/graphql/errors';
import { Proceeding } from '@backend/graphql/modules/proceedings/create/proceedingType';
import { CustomContext } from '@backend/types/types';

@Resolver(() => Proceeding)
export class DeleteProceedingsResolver {
  @Mutation(() => Boolean)
  async deleteProceedings(
    @Arg('id') id: number,
    @Ctx()
    { authUser, proceedingsRepository }: CustomContext,
  ): Promise<boolean> {
    if (!authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    if (
      !(await proceedingsRepository.isUserNotaryInProceeding(authUser.id, id))
    ) {
      throw unauthorizedError('Unauthorized to delete the proceeding.');
    }

    const existingProceeding =
      await proceedingsRepository.getProceedingById(id);
    if (!existingProceeding) {
      throw new GraphQLError('Proceedings not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    await proceedingsRepository.deleteProceeding(id);

    const deletedProceeding = await proceedingsRepository.getProceedingById(id);
    if (deletedProceeding) {
      throw new GraphQLError('Delete failed: proceeding still exists', {
        extensions: {
          code: 'DELETE_FAILED',
        },
      });
    }

    return true;
  }
}
