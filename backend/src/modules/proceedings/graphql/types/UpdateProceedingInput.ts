import { Field, InputType } from 'type-graphql';

import { DeceasedPersonInput } from '@backend/modules/schedules/graphql/types/DeceasedPersonInput';

@InputType()
export class UpdateProceedingInput {
  @Field()
  deceasedPersonInfo!: DeceasedPersonInput;
}
