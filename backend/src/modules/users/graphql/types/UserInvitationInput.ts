import { Field, InputType } from 'type-graphql';

@InputType()
class LabelValue {
  @Field()
  label!: string;

  @Field()
  value!: string;
}

@InputType()
class NumberedLabelValue {
  @Field()
  label!: number;

  @Field()
  value!: number;
}

@InputType()
class DayMonth {
  @Field(() => [NumberedLabelValue])
  days!: NumberedLabelValue[];

  @Field(() => [NumberedLabelValue])
  months!: NumberedLabelValue[];
}

@InputType()
class Rules {
  @Field()
  lastnameLetters!: boolean;

  @Field()
  birthDaysMonths!: boolean;

  @Field()
  deathDaysMonths!: boolean;
}

@InputType()
export class Criteria {
  @Field(() => LabelValue, { nullable: true })
  court!: LabelValue;

  @Field(() => [LabelValue], { nullable: true })
  lastnameLetters!: LabelValue[];

  @Field(() => [DayMonth], { nullable: true })
  birthDaysMonths!: DayMonth[];

  @Field(() => [DayMonth], { nullable: true })
  deathDaysMonths!: DayMonth[];

  @Field(() => Rules, { nullable: true })
  rules!: Rules;
}

// Main Input class
@InputType()
export class UserInvitationInput {
  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field()
  email!: string;

  @Field()
  role!: string;

  @Field()
  criteria!: Criteria;
}
