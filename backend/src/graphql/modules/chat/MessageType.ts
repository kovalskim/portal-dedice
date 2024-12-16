import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Message {
  @Field(() => ID)
  id!: number;

  @Field(() => Number)
  userId!: number;

  @Field(() => Number)
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
