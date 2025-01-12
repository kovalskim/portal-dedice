import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Blog {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  title!: string;

  @Field(() => String)
  content!: string;

  @Field(() => String)
  coverImagePath!: string;

  @Field(() => String)
  coverImageFullAWSPath!: string;

  @Field(() => Date)
  blogDate!: Date;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String, { nullable: true })
  authorName?: string;

  @Field(() => [Blog], { nullable: true })
  additionalBlogs?: Blog[];
}
