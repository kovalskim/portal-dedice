import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { CustomContext } from '@backend/types/types';

import { createProceedingsSchema } from './createProceedingsSchema';
import { CreateProceedingsInput, Proceedings } from './proceedingsType';

@Resolver(() => Proceedings)
export class CreateProceedingsResolver {
  @Mutation(() => Proceedings)
  async createProceedings(
    @Arg('data') input: CreateProceedingsInput,
    @Ctx() { authUser }: CustomContext,
  ): Promise<Proceedings> {
    try {
      createProceedingsSchema.parse(input);
    } catch (error) {
      throw new GraphQLError('Validation error', {
        extensions: {
          code: 'NOT_VALID_INPUT',
        },
      });
    }

    // Check if the user is authorized to create the proceedings (is notary)

    // Create the proceedings in the database

    // Return the created proceedings
    return {
      id: 1,
      proceedingsNumber: input.proceedingsNumber,
      deceisedFirstName: input.deceisedFirstName,
      deceisedLastName: input.deceisedLastName,
      deceisedDateOfDeath: input.deceisedDateOfDeath,
    };
  }
}
