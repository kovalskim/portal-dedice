import { ArgsType, Field } from 'type-graphql';

export type SortOrder = 'asc' | 'desc' | 'default';

@ArgsType()
export class UsersArgs {
  @Field(() => Number, { defaultValue: 1 })
  currentPage!: number;

  @Field(() => Number, { defaultValue: 5 })
  pageSize!: number;

  @Field(() => String, { defaultValue: 'default' })
  sortByFirstnameOrder?: SortOrder;

  @Field(() => String, { defaultValue: 'default' })
  sortByLastnameOrder?: SortOrder;

  @Field(() => String, { defaultValue: 'default' })
  sortByEmailOrder?: SortOrder;

  @Field(() => String, { nullable: true })
  filterFirstname?: string;

  @Field(() => String, { nullable: true })
  filterLastname?: string;

  @Field(() => String, { nullable: true })
  filterEmail?: string;

  @Field(() => Number, { nullable: true })
  filterRoleId?: number;

  @Field(() => Number, { nullable: true })
  filterIsVerified?: number;

  @Field(() => Number, { nullable: true })
  filterIsBanned?: number;
}
