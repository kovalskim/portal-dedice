import { Ctx, Query, Resolver } from 'type-graphql';

import { districts } from '@backend/db/schema';
import { District } from '@backend/modules/schedules/graphql/types/DistrictType';
import { CustomContext } from '@backend/types/types';

@Resolver(() => District)
export class DistrictResolver {
  @Query(() => [District])
  async districts(@Ctx() { db }: CustomContext): Promise<District[]> {
    return db.select().from(districts);
  }
}
