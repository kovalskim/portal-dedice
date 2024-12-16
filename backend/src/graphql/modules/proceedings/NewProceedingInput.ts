import { Field, InputType } from 'type-graphql';

import { ParticipantInput } from '@backend/graphql/modules/proceedings/ParticipantInput';
import { DeceasedPersonInput } from '@backend/graphql/modules/schedules/DeceasedPersonInput';

@InputType()
export class NewProceedingInput {
  @Field()
  deceasedPersonInfo!: DeceasedPersonInput;

  @Field()
  narratorContactInfo!: ParticipantInput;
}
