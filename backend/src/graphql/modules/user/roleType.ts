import { Field, ID, ObjectType } from 'type-graphql';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  NOTARY = 'notary',
}

@ObjectType()
export class Role {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  name!: UserRole;
}
