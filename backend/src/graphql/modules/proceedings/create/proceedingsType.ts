import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Proceedings {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  proceedingsNumber!: string;

  @Field(() => String)
  deceisedFirstName!: string;

  @Field(() => String)
  deceisedLastName!: string;

  @Field(() => String)
  deceisedDateOfDeath!: string;
}

@ObjectType()
export class CreateProceedingsInput {
  @Field(() => String)
  proceedingsNumber!: string;

  @Field(() => String)
  deceisedFirstName!: string;

  @Field(() => String)
  deceisedLastName!: string;

  @Field(() => String)
  deceisedDateOfDeath!: string;
}
