import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { parseAndVerifyParticipationInvitationJWT } from '@backend/libs/jwt';
import { PARTICIPANT_STATES } from '@backend/utils/constants';
import {
  Authenticated,
  AuthenticatedContext,
} from '@backend/utils/decorators/Authenticated';

@Resolver()
export class AcceptParticipantInvitationResolver {
  @Mutation(() => Number)
  @Authenticated()
  async acceptParticipantInvitation(
    @Arg('token') token: string,
    @Ctx()
    {
      authUser,
      participantInvitationsRepository,
      participantsRepository,
      usersRepository,
    }: AuthenticatedContext,
  ): Promise<number> {
    const payload = parseAndVerifyParticipationInvitationJWT(token);
    if (!payload || !payload.email) {
      throw new GraphQLError('Invalid token', {
        extensions: { code: 'INVALID_TOKEN' },
      });
    }

    const invitation =
      await participantInvitationsRepository.getParticipantInvitationByToken(
        token,
      );
    if (!invitation) {
      throw new GraphQLError('Invitation not found or expired', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    const registeredUser = await usersRepository.getUserByEmail(payload.email);
    if (!registeredUser || registeredUser.id !== authUser.id) {
      throw new GraphQLError('Unauthorized. Email mismatch.', {
        extensions: { code: 'UNAUTHORIZED' },
      });
    }

    const isAlreadyParticipant =
      await participantsRepository.isUserParticipantInProceeding(
        registeredUser.id,
        invitation.proceedingId,
      );

    if (!isAlreadyParticipant) {
      await participantsRepository.addParticipant({
        userId: registeredUser.id,
        proceedingId: invitation.proceedingId,
        participantStateId: PARTICIPANT_STATES.APPROVED,
      });
      await participantInvitationsRepository.deleteParticipantInvitation(
        invitation.id,
      );
    }

    return invitation.proceedingId;
  }
}
