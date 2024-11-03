import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class District {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  courtId!: number;
}
