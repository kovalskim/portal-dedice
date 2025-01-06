import { Field, InputType } from 'type-graphql';

import { DeceasedPersonInput } from '@backend/graphql/modules/schedules/DeceasedPersonInput';

@InputType()
export class UpdateProceedingInput {
  @Field()
  deceasedPersonInfo!: DeceasedPersonInput;
}
