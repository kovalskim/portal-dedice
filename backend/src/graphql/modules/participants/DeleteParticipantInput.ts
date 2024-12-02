import { Field, InputType } from 'type-graphql';

@InputType()
export class DeleteParticipantInput {
  @Field()
  proceedingId!: number;

  @Field()
  participantId!: number;
}
