import { Field, InputType } from 'type-graphql';

import { ParticipantInput } from '@backend/modules/proceedings/graphql/types/ParticipantInput';

@InputType()
export class ParticipantsInput {
  @Field()
  proceedingId!: number;

  @Field(() => [ParticipantInput])
  participants!: ParticipantInput[];
}
