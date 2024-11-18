import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { unauthorizedError } from '@backend/graphql/errors';
import { Proceedings } from '@backend/graphql/modules/proceedings/create/proceedingsType';
import { CustomContext } from '@backend/types/types';

@Resolver(() => Proceedings)
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

    const existingProceedings =
      await proceedingsRepository.getProceedingsById(id);
    if (!existingProceedings) {
      throw new GraphQLError('Proceedings not found', {
        extensions: {
          code: 'NOT_FOUND',
        },
      });
    }

    await proceedingsRepository.deleteProceeding(id);

    const deletedProceeding =
      await proceedingsRepository.getProceedingsById(id);
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
