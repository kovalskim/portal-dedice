import { Field, ID, ObjectType } from 'type-graphql';

import { User } from '@backend/graphql/modules/user/userType';

@ObjectType()
export class Message {
  @Field(() => ID)
  id!: number;

  @Field(() => Number, { nullable: true })
  userId!: number | null;

  @Field(() => User || null, { nullable: true })
  user!: User | null;

  @Field(() => Number, { nullable: true })
  proceedingId!: number;

  @Field()
  text!: string;

  @Field()
  timestamp!: Date;
}

@ObjectType()
export class NewMessageNotification {
  @Field(() => ID)
  id!: number;
}
