import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Payload {
  @Field(() => Number, { nullable: true })
  id!: number;

  @Field(() => Number, { nullable: true })
  iat!: number;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Number, { nullable: true })
  userId?: number;

  @Field(() => String, { nullable: true })
  firstname?: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field(() => String, { nullable: true })
  role?: string;
}
