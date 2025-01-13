import { Field, InputType } from 'type-graphql';

@InputType()
export class NewBlogInput {
  @Field(() => String)
  title!: string;

  @Field(() => String)
  content!: string;

  @Field(() => String)
  coverImagePath!: string;

  @Field(() => String)
  blogDate!: string;
}
