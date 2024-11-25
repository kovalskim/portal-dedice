import { Field, ID, ObjectType } from 'type-graphql';

import { User } from '@backend/graphql/modules/user/userType';

@ObjectType()
export class File {
  @Field(() => ID)
  id!: number;

  @Field()
  path!: string;

  @Field()
  timestamp!: string;

  @Field(() => User)
  user!: User;

  @Field()
  alias!: string;

  @Field()
  proceedingId!: number;

  @Field()
  type!: string;
}
