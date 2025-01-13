import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateParticipantStateInput {
  @Field()
  proceedingId!: number;

  @Field()
  participantId!: number;
}
