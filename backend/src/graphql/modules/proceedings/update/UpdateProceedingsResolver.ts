import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { unauthorizedError } from '@backend/graphql/errors';
import { DeceasedPersonInput } from '@backend/graphql/modules/educator/DeceasedPersonInput';
import { baseDeceasedInfoSchema } from '@backend/graphql/modules/proceedings/create/NewProceedingInputSchema';
import { Proceedings } from '@backend/graphql/modules/proceedings/create/proceedingsType';
import { CustomContext } from '@backend/types/types';

@Resolver(() => Proceedings)
export class UpdateProceedingsResolver {
  @Mutation(() => Proceedings)
  async updateProceedings(
    @Arg('id') id: number,
    @Arg('data') input: DeceasedPersonInput,
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<Proceedings> {
    try {
      baseDeceasedInfoSchema.parse(input);
    } catch (error) {
      throw new GraphQLError('Validation error', {
        extensions: {
          code: 'NOT_VALID_INPUT',
        },
      });
    }

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
      throw unauthorizedError('Unauthorized to update the proceeding.');
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

    await proceedingsRepository.updateProceeding(id, {
      deceasedFirstName: input.firstname,
      deceasedLastName: input.lastname,
      deceasedDateOfDeath: new Date(input.deathdate),
      deceasedDateOfBirth: new Date(input.birthdate),
      deceasedStreetWithNumber: input.streetWithNumber,
      deceasedCity: input.city,
      deceasedDistrict: input.district,
      deceasedPostalCode: input.postalCode,
      deceasedSex: input.sex,
    });

    const updatedProceedings =
      await proceedingsRepository.getProceedingsById(id);

    return {
      ...updatedProceedings,
      deceasedDateOfDeath: updatedProceedings.deceasedDateOfDeath.toISOString(),
      deceasedDateOfBirth: updatedProceedings.deceasedDateOfBirth.toISOString(),
      startDate: updatedProceedings.startDate.toISOString(),
    };
  }
}
