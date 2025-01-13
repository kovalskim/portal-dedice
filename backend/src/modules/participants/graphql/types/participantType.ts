import { Field, ObjectType } from 'type-graphql';

import { User } from '@backend/modules/users/graphql/types/userType';

@ObjectType()
export class ParticipantState {
  @Field(() => Number)
  id!: number;

  @Field(() => String)
  title!: string;
}

@ObjectType()
export class Participant {
  @Field(() => Number)
  participantId!: number;

  @Field(() => Number)
  proceedingId!: number;

  @Field(() => ParticipantState)
  participantState!: ParticipantState;

  @Field(() => User)
  user!: User;
}
