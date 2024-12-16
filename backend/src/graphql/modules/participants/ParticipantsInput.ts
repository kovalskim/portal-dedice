import { Field, InputType } from 'type-graphql';

import { ParticipantInput } from '@backend/graphql/modules/proceedings/ParticipantInput';

@InputType()
export class ParticipantsInput {
  @Field()
  proceedingId!: number;

  @Field(() => [ParticipantInput])
  participants!: ParticipantInput[];
}
