import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { DeleteParticipantInput } from '@backend/graphql/modules/participants/DeleteParticipantInput';
import { ParticipantsInput } from '@backend/graphql/modules/participants/ParticipantsInput';
import { Participant } from '@backend/graphql/modules/participants/participantType';
import { UpdateParticipantStateInput } from '@backend/graphql/modules/participants/UpdateParticipantStateInput';
import { CustomContext } from '@backend/types/types';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver()
export class ParticipantsResolver {
  @Query(() => [Participant])
  @Authenticated()
  async proceedingParticipants(
    @Arg('id') proceedingId: number,
    @Ctx() { authUser, participantsService }: AuthenticatedContext,
  ): Promise<Participant[]> {
    return await participantsService.findParticipantsInProceeding(
      authUser!.id,
      proceedingId,
    );
  }

  @Mutation(() => [Number])
  @Authenticated()
  async inviteParticipantToProceeding(
    @Arg('data')
    input: ParticipantsInput,
    @Ctx()
    { authUser, participantsService }: CustomContext,
  ) {
    return participantsService.inviteParticipantToProceeding(
      authUser!.id,
      input,
    );
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
    { authUser, participantsService }: CustomContext,
  ) {
    return await participantsService.approveParticipant(
      authUser!.id,
      input.proceedingId,
      input.participantId,
    );
  }

  @Mutation(() => Participant)
  @Authenticated()
  async rejectParticipant(
    @Arg('data')
    input: UpdateParticipantStateInput,
    @Ctx()
    { authUser, participantsService }: CustomContext,
  ) {
    return await participantsService.rejectParticipant(
      authUser!.id,
      input.proceedingId,
      input.participantId,
    );
  }

  @Mutation(() => Boolean)
  @Authenticated()
  async deleteParticipantById(
    @Arg('data') input: DeleteParticipantInput,
    @Ctx()
    { authUser, participantsService }: CustomContext,
  ) {
    await participantsService.deleteParticipantById(
      authUser!.id,
      input.proceedingId,
      input.participantId,
    );
    return true;
  }
}
