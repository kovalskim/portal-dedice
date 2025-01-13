import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Schedule {
  @Field(() => ID)
  id!: number;

  @Field({ nullable: true })
  notaryId?: number;

  @Field()
  notaryName!: string;

  @Field({ nullable: true })
  secondaryNotaryId?: number;

  @Field()
  secondaryNotaryName!: string;

  @Field()
  courtId!: number;

  @Field()
  pattern!: string;
}
