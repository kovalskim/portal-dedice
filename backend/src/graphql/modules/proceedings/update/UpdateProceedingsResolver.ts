import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { unauthorizedError } from '@backend/graphql/errors';
import { DeceasedPersonInput } from '@backend/graphql/modules/educator/DeceasedPersonInput';
import { Proceeding } from '@backend/graphql/modules/proceedings/create/proceedingType';
import { CustomContext } from '@backend/types/types';
import { deceasedInfoSchema } from '@shared/schemas/deceasedInfoSchema';

@Resolver(() => Proceeding)
export class UpdateProceedingsResolver {
  @Mutation(() => Proceeding)
  async updateProceedings(
    @Arg('id') id: number,
    @Arg('data') input: DeceasedPersonInput,
    @Ctx() { authUser, proceedingsRepository }: CustomContext,
  ): Promise<Proceeding> {
    try {
      deceasedInfoSchema.parse(input);
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

    const existingProceeding =
      await proceedingsRepository.getProceedingById(id);
    if (!existingProceeding) {
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

    const updatedProceeding = await proceedingsRepository.getProceedingById(id);

    return {
      ...updatedProceeding,
    };
  }
}
