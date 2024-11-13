import { Field, ID, ObjectType } from 'type-graphql';

import { Role } from './roleType';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: number;

  @Field(() => String, { nullable: true })
  beforeTitle!: string | null;

  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field(() => String, { nullable: true })
  afterTitle!: string | null;

  @Field()
  email!: string;

  @Field()
  isVerified!: boolean;
}

@ObjectType()
export class AuthInfo {
  @Field(() => User)
  user!: User;

  @Field()
  token!: string;
}

@ObjectType()
export class SignInInfo extends AuthInfo {
  @Field(() => Role)
  role!: Role;
}
