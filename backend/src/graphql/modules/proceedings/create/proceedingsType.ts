import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Proceedings {
  @Field(() => ID)
  id!: number;

  @Field(() => Number)
  phaseId!: number;

  @Field(() => Number)
  notaryId!: number;

  @Field(() => Date)
  startDate!: Date;

  @Field(() => String)
  proceedingsNumber!: string;

  @Field(() => String)
  deceasedFirstName!: string;

  @Field(() => String)
  deceasedLastName!: string;

  @Field(() => Date)
  deceasedDateOfDeath!: Date;

  @Field(() => Date)
  deceasedDateOfBirth!: Date;

  @Field(() => String)
  deceasedStreetWithNumber!: string;

  @Field(() => String)
  deceasedCity!: string;

  @Field(() => String)
  deceasedDistrict!: string;

  @Field(() => String)
  deceasedPostalCode!: string;

  @Field(() => String, { nullable: true })
  deceasedSex?: string;

  @Field({ nullable: true })
  narratorFirstname?: string;

  @Field({ nullable: true })
  narratorLastname?: string;

  @Field({ nullable: true })
  narratorEmail?: string;

  @Field(() => String, { nullable: true })
  phaseTitle?: string;
}

@ObjectType()
export class PaginatedProceedings {
  @Field(() => [Proceedings])
  data!: Proceedings[];

  @Field(() => Number)
  total!: number;
}
