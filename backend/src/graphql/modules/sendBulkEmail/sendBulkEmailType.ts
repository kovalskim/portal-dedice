import { Field, InputType } from 'type-graphql';

@InputType()
export class SendEmailRequest {
  @Field()
  proceedingsId!: number;

  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field(() => [String])
  receivers!: string[];
}
