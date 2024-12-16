import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';

import { Court } from '@backend/graphql/modules/schedules/CourtType';
import { DeceasedPersonInput } from '@backend/graphql/modules/schedules/DeceasedPersonInput';
import { Schedule } from '@backend/graphql/modules/schedules/ScheduleType';
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

  @Mutation(() => Schedule)
  async identifyNotary(
    @Arg('data') input: DeceasedPersonInput,
    @Ctx() { scheduleService }: CustomContext,
  ): Promise<Schedule> {
    return await scheduleService.identifyNotary(input);
  }
}
