import { Field, InputType, Int } from 'type-graphql';

@InputType()
class FinancialInstrumentInput {
  @Field()
  selectedBank!: string;
}

@InputType()
class BusinessParticipationInput {
  @Field()
  ico!: string;
}

@InputType()
class CarInput {
  @Field()
  brand!: string;

  @Field(() => Int)
  registrationYear!: number;

  @Field()
  typeDetail!: string;
}

@InputType()
class ValuableInput {
  @Field()
  description!: string;
}

@InputType()
class OtherInput {
  @Field()
  description!: string;
}

@InputType()
export class CreateAssetsAllInput {
  @Field(() => [FinancialInstrumentInput])
  financialInstruments!: FinancialInstrumentInput[];
  @Field(() => [BusinessParticipationInput])
  businessParticipations!: BusinessParticipationInput[];
  @Field(() => [CarInput])
  cars!: CarInput[];
  @Field(() => [ValuableInput])
  valuables!: ValuableInput[];
  @Field(() => [OtherInput])
  others!: OtherInput[];
}
