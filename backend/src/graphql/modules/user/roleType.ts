import { Field, ID, ObjectType } from 'type-graphql';

import { UserRole } from '@backend/dtos/RoleDTO';

@ObjectType()
export class Role {
  @Field(() => ID)
  id!: number;

  @Field(() => String)
  name!: UserRole;
}
