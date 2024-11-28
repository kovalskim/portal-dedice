import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { unauthorizedError } from '@backend/errors/graphqlErrors';
import { Proceeding } from '@backend/graphql/modules/proceedings/create/proceedingType';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver(() => Proceeding)
export class DeleteProceedingResolver {
  @Mutation(() => Boolean)
  @Authenticated()
  async deleteProceeding(
    @Arg('id') id: number,
    @Ctx()
    { authUser, proceedingsRepository }: AuthenticatedContext,
  ): Promise<boolean> {
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
