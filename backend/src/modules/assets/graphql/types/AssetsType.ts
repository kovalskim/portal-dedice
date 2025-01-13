import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
class FinancialInstrument {
  @Field()
  id!: number;

  @Field()
  assetId!: number;

  @Field()
  selectedBank!: string;
}

@ObjectType()
class BusinessParticipation {
  @Field()
  id!: number;

  @Field()
  assetId!: number;

  @Field()
  ico!: string;
}

@ObjectType()
class Car {
  @Field()
  id!: number;

  @Field()
  assetId!: number;

  @Field()
  brand!: string;

  @Field(() => Int)
  registrationYear!: number;

  @Field()
  typeDetail!: string;
}

@ObjectType()
class Valuable {
  @Field()
  id!: number;

  @Field()
  assetId!: number;

  @Field()
  description!: string;
}

@ObjectType()
class Other {
  @Field()
  id!: number;

  @Field()
  assetId!: number;

  @Field()
  description!: string;
}

@ObjectType()
class GeneralInfo {
  @Field()
  id!: number;
  @Field()
  lastModified!: Date;
  @Field()
  modifiedBy!: string;
  @Field()
  proceedingsId!: number;
}

@ObjectType()
export class AssetsAll {
  @Field(() => GeneralInfo)
  generalInfo!: GeneralInfo;
  @Field(() => [FinancialInstrument])
  financialInstruments!: FinancialInstrument[];
  @Field(() => [BusinessParticipation])
  businessParticipations!: BusinessParticipation[];
  @Field(() => [Car])
  cars!: Car[];
  @Field(() => [Valuable])
  valuables!: Valuable[];
  @Field(() => [Other])
  others!: Other[];
}
