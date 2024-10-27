import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Proceedings {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  proceedingsNumber!: string;

  @Field(() => String)
  deceasedFirstName!: string;

  @Field(() => String)
  deceasedLastName!: string;

  @Field(() => String)
  deceasedDateOfDeath!: string;
}
