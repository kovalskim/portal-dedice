import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class DayMonthType {
  @Field(() => [Number])
  days!: number[];

  @Field(() => [Number])
  months!: number[];
}

@ObjectType()
class RulesType {
  @Field()
  lastnameLetters!: boolean;

  @Field()
  birthDaysMonths!: boolean;

  @Field()
  deathDaysMonths!: boolean;
}

@ObjectType()
class CourtType {
  @Field(() => Number)
  id!: number;

  @Field(() => String)
  name!: string;
}

@ObjectType()
export class NotaryCriteriaType {
  @Field(() => CourtType, { nullable: true })
  court!: CourtType;

  @Field(() => [String], { nullable: true })
  lastnameLetters!: string[];

  @Field(() => [DayMonthType], { nullable: true })
  birthDaysMonths!: DayMonthType[];

  @Field(() => [DayMonthType], { nullable: true })
  deathDaysMonths!: DayMonthType[];

  @Field(() => RulesType, { nullable: true })
  rules!: RulesType;
}
