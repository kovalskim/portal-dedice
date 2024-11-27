import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { NewProceedingInput } from '@backend/graphql/modules/proceedings/create/NewProceedingInput';
import { Proceeding } from '@backend/graphql/modules/proceedings/create/proceedingType';
import { UserRole } from '@backend/graphql/modules/user/roleType';
import { createToken } from '@backend/libs/jwt';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';
import { newProceedingInputSchema } from '@shared/schemas/newProceedingInputSchema';

@Resolver(() => Proceeding)
export class CreateProceedingsResolver {
  @Mutation(() => Proceeding)
  @Authenticated()
  async createProceeding(
    @Arg('data') input: NewProceedingInput,
    @Ctx()
    {
      authUser,
      usersRepository,
      proceedingsRepository,
      participantInvitationsRepository,
      emailService,
    }: AuthenticatedContext,
  ): Promise<Proceeding> {
    try {
      newProceedingInputSchema.parse(input);
    } catch (error) {
      throw new GraphQLError('Validation error', {
        extensions: {
          code: 'NOT_VALID_INPUT',
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

    const proceedingsNumber = `${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDate()}_${input.deceasedPersonInfo.firstname[0]}${input.deceasedPersonInfo.lastname.slice(0, 2)}`;
    // Create the proceedings in the database
    const newProceedingId = await proceedingsRepository.createProceeding({
      proceedingNumber: proceedingsNumber,
      notaryId: authUser!.id,
      startDate: new Date(), //TODO: taky jako input
      deceasedFirstName: input.deceasedPersonInfo.firstname,
      deceasedLastName: input.deceasedPersonInfo.lastname,
      deceasedDateOfDeath: new Date(input.deceasedPersonInfo.deathdate),
      deceasedDateOfBirth: new Date(input.deceasedPersonInfo.birthdate),
      deceasedStreetWithNumber: input.deceasedPersonInfo.streetWithNumber,
      deceasedCity: input.deceasedPersonInfo.city,
      deceasedDistrict: input.deceasedPersonInfo.district,
      deceasedPostalCode: input.deceasedPersonInfo.postalCode,
      deceasedSex: input.deceasedPersonInfo.sex,
    });

    const token = createToken({ email: input.narratorContactInfo.email });

    await participantInvitationsRepository.createParticipantInvitation({
      proceedingId: newProceedingId,
      participantEmail: input.narratorContactInfo.email!,
      participantFirstname: input.narratorContactInfo.firstname!,
      participantLastname: input.narratorContactInfo.lastname!,
      token: token,
      expiresAt: new Date(),
    });

    await emailService.sendNarratorInvitationEmail(
      input.narratorContactInfo.email!,
      input.narratorContactInfo.firstname!,
      input.narratorContactInfo.lastname!,
      token,
    );

    const newProceeding =
      await proceedingsRepository.getProceedingById(newProceedingId);

    // Return the created proceedings
    return {
      ...newProceeding,
    };
  }
}
