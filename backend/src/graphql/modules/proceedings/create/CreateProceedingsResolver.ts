import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { CustomContext } from '@backend/types/types';

import { UserRole } from '../../user/roleType';

import { createProceedingsSchema } from './createProceedingsSchema';
import { Proceedings } from './proceedingsType';

@Resolver(() => Proceedings)
export class CreateProceedingsResolver {
  @Mutation(() => Proceedings)
  async createProceedings(
    @Arg('proceedingsNumber') proceedingsNumber: string,
    @Arg('deceasedFirstName') deceasedFirstName: string,
    @Arg('deceasedLastName') deceasedLastName: string,
    @Arg('deceasedDateOfDeath') deceasedDateOfDeath: string,
    @Ctx() { authUser, usersRepository, proceedingsRepository }: CustomContext,
  ): Promise<Proceedings> {
    try {
      createProceedingsSchema.parse({
        proceedingsNumber,
        deceasedFirstName,
        deceasedLastName,
        deceasedDateOfDeath,
      });
    } catch (error) {
      throw new GraphQLError('Validation error', {
        extensions: {
          code: 'NOT_VALID_INPUT',
        },
      });
    }

    // Check if the user is authorized to create the proceedings (is notary)
    if (!authUser) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHENTICATED',
        },
      });
    }

    const userRole = await usersRepository.getUserRole(authUser.id);
    if (userRole?.name !== UserRole.NOTARY) {
      throw new GraphQLError('Unauthorized', {
        extensions: {
          code: 'UNAUTHORIZED',
        },
      });
    }

    // Create the proceedings in the database
    const newProceedingsId = await proceedingsRepository.createProceedings({
      proceedingsNumber: proceedingsNumber,
      deceasedFirstName: deceasedFirstName,
      deceasedLastName: deceasedLastName,
      deceasedDateOfDeath: new Date(deceasedDateOfDeath),
      notaryId: authUser!.userId,
    });

    const newProceedings =
      await proceedingsRepository.getProceedingsById(newProceedingsId);

    // Return the created proceedings
    return {
      ...newProceedings,
      deceasedDateOfDeath: newProceedings.deceasedDateOfDeath.toISOString(),
    };
  }
}
