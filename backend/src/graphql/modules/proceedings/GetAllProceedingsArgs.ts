import { ArgsType, Field } from 'type-graphql';

export type SortOrder = 'asc' | 'desc';

@ArgsType()
export class GetAllProceedingsArgs {
  @Field(() => Number, { defaultValue: 1 })
  currentPage!: number;

  @Field(() => Number, { defaultValue: 2 })
  pageSize!: number;

  @Field(() => String, { defaultValue: 'default' })
  sortOrder!: SortOrder;

  @Field(() => String, { nullable: true })
  filterProceedingNumber?: string;

  @Field(() => String, { nullable: true })
  filterDeceasedName?: string;

  @Field(() => String, { nullable: true })
  filterStartDate?: string;

  @Field(() => Number, { nullable: true })
  filterPhaseId?: number;

  @Field(() => String, { nullable: true })
  filterStatus?: string;
}
