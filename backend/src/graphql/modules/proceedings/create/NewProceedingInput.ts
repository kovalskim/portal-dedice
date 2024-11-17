import { Field, InputType } from 'type-graphql';

import { DeceasedPersonInput } from '@backend/graphql/modules/educator/DeceasedPersonInput';
import { ParticipantInput } from '@backend/graphql/modules/proceedings/create/ParticipantInput';

@InputType()
export class NewProceedingInput {
  @Field()
  deceasedPersonInfo!: DeceasedPersonInput;

  @Field()
  narratorContactInfo!: ParticipantInput;
}
