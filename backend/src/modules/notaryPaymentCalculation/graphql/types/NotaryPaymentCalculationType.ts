import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class NotaryPaymentCalculation {
  @Field()
  total!: number;

  @Field()
  fee!: number;

  @Field()
  vat!: number;
}
