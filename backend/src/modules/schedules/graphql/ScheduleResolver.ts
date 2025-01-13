import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Court } from '@backend/modules/schedules/graphql/types/CourtType';
import { DeceasedPersonInput } from '@backend/modules/schedules/graphql/types/DeceasedPersonInput';
import { Schedule } from '@backend/modules/schedules/graphql/types/ScheduleType';
import { CustomContext } from '@backend/types/types';

@Resolver(() => Schedule)
export class ScheduleResolver {
  @FieldResolver(() => Court)
  async court(
    @Root() schedule: Schedule,
    @Ctx() { scheduleService }: CustomContext,
  ): Promise<Court> {
    return await scheduleService.getCourtById(schedule.courtId);
  }

  @Query(() => [Court])
  async courts(@Ctx() { scheduleService }: CustomContext) {
    return await scheduleService.findAllCourts();
  }

  @Mutation(() => Schedule)
  async identifyNotary(
    @Arg('data') input: DeceasedPersonInput,
    @Ctx() { scheduleService }: CustomContext,
  ): Promise<Schedule> {
    return await scheduleService.identifyNotary(input);
  }
}
