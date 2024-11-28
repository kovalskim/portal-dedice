import { Field, InputType } from 'type-graphql';

@InputType()
export class SendEmailRequest {
  @Field()
  proceedingId!: number;

  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field(() => [String])
  receivers!: string[];
}
