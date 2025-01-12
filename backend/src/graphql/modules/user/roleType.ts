import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Role {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  description!: string;
}
