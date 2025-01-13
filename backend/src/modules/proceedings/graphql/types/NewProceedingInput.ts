import { Field, InputType } from 'type-graphql';

import { ParticipantInput } from '@backend/modules/proceedings/graphql/types/ParticipantInput';
import { DeceasedPersonInput } from '@backend/modules/schedules/graphql/types/DeceasedPersonInput';

@InputType()
export class NewProceedingInput {
  @Field()
  deceasedPersonInfo!: DeceasedPersonInput;

  @Field()
  narratorContactInfo!: ParticipantInput;
}
