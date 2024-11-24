import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { NewProceedingInput } from '@backend/graphql/modules/proceedings/create/NewProceedingInput';
import { Proceedings } from '@backend/graphql/modules/proceedings/create/proceedingsType';
import { UserRole } from '@backend/graphql/modules/user/roleType';
import { createToken } from '@backend/libs/jwt';
import { sendNarratorInvitationEmail } from '@backend/services/emailService/emailService';
import { CustomContext } from '@backend/types/types';
import { newProceedingInputSchema } from '@shared/schemas/newProceedingInputSchema';

@Resolver(() => Proceedings)
export class CreateProceedingsResolver {
  @Mutation(() => Proceedings)
  async createProceedings(
    @Arg('data') input: NewProceedingInput,
    @Ctx()
    {
      authUser,
      usersRepository,
      proceedingsRepository,
      participantInvitationsRepository,
    }: CustomContext,
  ): Promise<Proceedings> {
    try {
      newProceedingInputSchema.parse(input);
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

    const proceedingsNumber = `${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDate()}_${input.deceasedPersonInfo.firstname[0]}${input.deceasedPersonInfo.lastname.slice(0, 2)}`;
    // Create the proceedings in the database
    const newProceedingsId = await proceedingsRepository.createProceedings({
      proceedingsNumber: proceedingsNumber,
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
      proceedingId: newProceedingsId,
      participantEmail: input.narratorContactInfo.email!,
      participantFirstname: input.narratorContactInfo.firstname!,
      participantLastname: input.narratorContactInfo.lastname!,
      token: token,
      expiresAt: new Date(),
    });

    await sendNarratorInvitationEmail(
      input.narratorContactInfo.email!,
      input.narratorContactInfo.firstname!,
      input.narratorContactInfo.lastname!,
      token,
    );

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
