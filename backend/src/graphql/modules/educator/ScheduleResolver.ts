import { and, eq, sql } from 'drizzle-orm';
import { GraphQLError } from 'graphql/error';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';

import { courts, districts, schedules } from '@backend/db/schema';
import { Court } from '@backend/graphql/modules/educator/CourtType';
import { DeceasedPersonInput } from '@backend/graphql/modules/educator/DeceasedPersonInput';
import { deceasedPersonInputSchema } from '@backend/graphql/modules/educator/DeceasedPersonInputSchema';
import { Schedule } from '@backend/graphql/modules/educator/ScheduleType';
import { CustomContext } from '@backend/types/types';

@Resolver(() => Schedule)
export class ScheduleResolver {
  @FieldResolver(() => Court)
  court(
    @Root() schedule: Schedule,
    @Ctx() { db }: CustomContext,
  ): Promise<Court> {
    return db
      .select()
      .from(courts)
      .where(eq(courts.id, schedule.courtId))
      .then(([court]) => court);
  }

  @Mutation(() => Schedule)
  async identifyNotary(
    @Arg('data') input: DeceasedPersonInput,
    @Ctx() { db }: CustomContext,
  ): Promise<Schedule> {
    try {
      deceasedPersonInputSchema.parse(input);
    } catch (error) {
      throw new GraphQLError('Validation error', {
        extensions: {
          code: 'NOT_VALID_INPUT',
        },
      });
    }

    if (input.district !== 'Hlavní město Praha') {
      throw new GraphQLError('Not supported', {
        extensions: {
          code: 'NOT_SUPPORTED_DISTRICT',
        },
      });
    }

    const districtValue =
      input.district === 'Hlavní město Praha' ? input.city : input.district; // kvůli Google API, které pro Prahu nevrací MČ jako okresy

    const competentCourt = await db
      .select()
      .from(districts)
      .innerJoin(courts, eq(districts.courtId, courts.id))
      .where(eq(districts.name, districtValue))
      .then(([result]) => result)
      .then(({ courts }) => courts);

    let attribute;
    switch (competentCourt.attribute) {
      case 'birthdate':
        attribute = input.birthdate;
    }

    const schedule = await db
      .select()
      .from(schedules)
      .where(
        and(
          eq(schedules.courtId, competentCourt.id),
          sql`${attribute}
          REGEXP
          ${schedules.pattern}`,
        ),
      )
      .then(([schedule]) => schedule as Schedule);

    if (!schedule) {
      throw new GraphQLError('Notary schedule not found error', {
        extensions: {
          code: 'NOT_FOUND_NOTARY_SCHEDULE',
        },
      });
    }
    return schedule;
  }
}
