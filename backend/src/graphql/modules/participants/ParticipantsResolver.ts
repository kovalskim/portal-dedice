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
    @Ctx() { authUser, participantService }: AuthenticatedContext,
  ): Promise<Participant[]> {
    return await participantService.findParticipantsInProceeding(
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
    { authUser, participantService }: CustomContext,
  ) {
    return participantService.inviteParticipantToProceeding(
      authUser!.id,
      input,
    );
  }

  @Mutation(() => Number)
  @Authenticated()
  async acceptParticipantInvitation(
    @Arg('token') token: string,
    @Ctx()
    { participantService }: CustomContext,
  ): Promise<number> {
    return await participantService.acceptParticipantInvitation(token);
  }

  @Mutation(() => Participant)
  @Authenticated()
  async approveParticipant(
    @Arg('data')
    input: UpdateParticipantStateInput,
    @Ctx()
    { authUser, participantService }: CustomContext,
  ) {
    return await participantService.approveParticipant(
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
    { authUser, participantService }: CustomContext,
  ) {
    return await participantService.rejectParticipant(
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
    { authUser, participantService }: CustomContext,
  ) {
    await participantService.deleteParticipantById(
      authUser!.id,
      input.proceedingId,
      input.participantId,
    );
    return true;
  }
}
