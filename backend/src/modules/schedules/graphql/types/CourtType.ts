import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Court {
  @Field(() => ID)
  id!: number;

  @Field()
  name!: string;

  @Field()
  attribute!: string;
}
