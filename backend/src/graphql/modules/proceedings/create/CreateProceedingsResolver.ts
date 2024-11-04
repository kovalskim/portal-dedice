import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { DeceasedPersonInput } from '@backend/graphql/modules/educator/DeceasedPersonInput';
import { CustomContext } from '@backend/types/types';

import { deceasedPersonInputSchema } from '../../educator/DeceasedPersonInputSchema';
import { UserRole } from '../../user/roleType';

import { Proceedings } from './proceedingsType';

@Resolver(() => Proceedings)
export class CreateProceedingsResolver {
  @Mutation(() => Proceedings)
  async createProceedings(
    @Arg('data') input: DeceasedPersonInput,
    @Ctx() { authUser, usersRepository, proceedingsRepository }: CustomContext,
  ): Promise<Proceedings> {
    try {
      deceasedPersonInputSchema.parse(input);
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

    const proceedingsNumber = `${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDate()}_${input.firstname[0]}${input.lastname.slice(0, 2)}`;

    // Create the proceedings in the database
    const newProceedingsId = await proceedingsRepository.createProceedings({
      proceedingsNumber: proceedingsNumber,
      notaryId: authUser!.userId,
      deceasedFirstName: input.firstname,
      deceasedLastName: input.lastname,
      deceasedDateOfDeath: new Date(input.deathdate),
      deceasedDateOfBirth: new Date(input.birthdate),
      deceasedStreetWithNumber: input.streetWithNumber,
      deceasedCity: input.city,
      deceasedDistrict: input.district,
      deceasedPostalCode: input.postalCode,
    });

    const newProceedings =
      await proceedingsRepository.getProceedingsById(newProceedingsId);

    // Return the created proceedings
    return {
      ...newProceedings,
      deceasedDateOfDeath: newProceedings.deceasedDateOfDeath.toISOString(),
      deceasedDateOfBirth: newProceedings.deceasedDateOfBirth.toISOString(),
      startDate: newProceedings.startDate.toISOString(),
    };
  }
}
