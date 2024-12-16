import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class File {
  @Field(() => ID)
  id!: number;

  @Field()
  path!: string;

  @Field()
  timestamp!: string;

  @Field()
  userId!: number;

  @Field()
  alias!: string;

  @Field()
  proceedingId!: number;

  @Field()
  type!: string;
}
