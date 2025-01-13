import { Field, InputType } from 'type-graphql';

@InputType()
export class DeceasedPersonInput {
  @Field()
  sex!: string;

  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field()
  birthdate!: string;

  @Field()
  deathdate!: string;

  @Field()
  streetWithNumber!: string;

  @Field()
  city!: string;

  @Field()
  district!: string;

  @Field()
  postalCode!: string;
}
