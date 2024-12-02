import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { AppError } from '@backend/errors/AppError';
import { DeleteParticipantInput } from '@backend/graphql/modules/participants/DeleteParticipantInput';
import { ParticipantsInput } from '@backend/graphql/modules/participants/ParticipantsInput';
import { UpdateParticipantStateInput } from '@backend/graphql/modules/participants/UpdateParticipantStateInput';
import { Participant } from '@backend/graphql/modules/proceedings/participantType';
import { CustomContext } from '@backend/types/types';
import { Authenticated } from '@backend/utils/decorators/Authenticated';

@Resolver()
export class ParticipantsResolver {
  @Mutation(() => [Number])
  @Authenticated()
  async inviteParticipantToProceeding(
    @Arg('data')
    input: ParticipantsInput,
    @Ctx()
    {
      authUser,
      participantValidationService,
      participantsService,
    }: CustomContext,
  ) {
    if (
      !(await participantValidationService.isUserNotaryInProceeding(
        authUser!.id,
        input.proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }
    return participantsService.inviteParticipantToProceeding(input);
  }

  @Mutation(() => Number)
  @Authenticated()
  async acceptParticipantInvitation(
    @Arg('token') token: string,
    @Ctx()
    { participantsService }: CustomContext,
  ): Promise<number> {
    return await participantsService.acceptParticipantInvitation(token);
  }

  @Mutation(() => Participant)
  @Authenticated()
  async approveParticipant(
    @Arg('data')
    input: UpdateParticipantStateInput,
    @Ctx()
    {
      authUser,
      participantsService,
      participantValidationService,
    }: CustomContext,
  ) {
    if (
      !(await participantValidationService.isUserNotaryInProceeding(
        authUser!.id,
        input.proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    return await participantsService.approveParticipant(input.participantId);
  }

  @Mutation(() => Participant)
  @Authenticated()
  async rejectParticipant(
    @Arg('data')
    input: UpdateParticipantStateInput,
    @Ctx()
    {
      authUser,
      participantsService,
      participantValidationService,
    }: CustomContext,
  ) {
    if (
      !(await participantValidationService.isUserNotaryInProceeding(
        authUser!.id,
        input.proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    return await participantsService.rejectParticipant(input.participantId);
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async deleteParticipantById(
    @Arg('data') data: DeleteParticipantInput,
    @Ctx()
    {
      authUser,
      participantValidationService,
      participantsService,
    }: CustomContext,
  ) {
    if (
      !(await participantValidationService.isUserNotaryInProceeding(
        authUser!.id,
        data.proceedingId,
      ))
    ) {
      throw new AppError('UNAUTHORIZED');
    }

    await participantsService.deleteParticipantById(data.participantId);
    return true;
  }
}
