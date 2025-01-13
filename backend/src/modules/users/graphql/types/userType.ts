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

  @Field()
  isBanned!: boolean;

  @Field()
  emailNotifications!: boolean;
}

@ObjectType()
export class AuthInfo {
  @Field(() => User)
  user!: User;

  @Field()
  token!: string;

  @Field(() => Role)
  role!: Role;
}

@ObjectType()
export class PaginatedUsers {
  @Field(() => [User])
  data!: User[];

  @Field(() => Number)
  total!: number;
}
