import { Field, InputType } from 'type-graphql';

@InputType()
export class ParticipantInput {
  @Field()
  firstname!: string;

  @Field()
  lastname!: string;

  @Field()
  email!: string;
}
