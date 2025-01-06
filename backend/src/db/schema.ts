import {
  boolean,
  date,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const roles = mysqlTable('roles', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
});

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  roleId: int('role_id')
    .notNull()
    .references(() => roles.id),
  beforeTitle: varchar('before_title', { length: 255 }),
  firstname: varchar('firstname', { length: 255 }).notNull(),
  lastname: varchar('lastname', { length: 255 }).notNull(),
  afterTitle: varchar('after_title', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  isVerified: boolean('isVerified').default(false).notNull(),
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  criteriaId: int('criteria_id').references(() => notaryCriteria.id),
});

export const userInvitations = mysqlTable('user_invitations', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull(),
  firstname: varchar('firstname', { length: 255 }).notNull(),
  lastname: varchar('lastname', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  criteriaId: int('criteria_id').references(() => notaryCriteria.id),
  token: varchar('token', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at'),
});

export const notaryCriteria = mysqlTable('notary_criteria', {
  id: int('id').primaryKey().autoincrement(),
  courtId: int('court_id')
    .notNull()
    .references(() => courts.id),
  lastnameLettersActive: boolean('lastname_letters_active').default(false),
  birthDaysMonthsActive: boolean('birth_days_months_active').default(false),
  deathDaysMonthsActive: boolean('death_days_months_active').default(false),
});

export const lettersCriteria = mysqlTable('letters_criteria', {
  id: int('id').primaryKey().autoincrement(),
  criteriaId: int('criteria_id').references(() => notaryCriteria.id),
  letter: varchar('letter', { length: 1 }).notNull(),
});

export const daysMonthsCriteria = mysqlTable('days_months_criteria', {
  id: int('id').primaryKey().autoincrement(),
  criteriaId: int('criteria_id').references(() => notaryCriteria.id),
  type: varchar('type', { length: 50 }).notNull(),
  day: int('day'),
  month: int('month'),
});

export const VerificationReason: [string, ...string[]] = [
  'register',
  'password_reset',
  'email_change',
] as const;

export type VerificationReasonType = (typeof VerificationReason)[number];

export const verificationTokens = mysqlTable('verification_tokens', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  token: varchar('token', { length: 255 }).notNull(),
  expiresAt: varchar('expires_at', { length: 255 }).notNull(),
  reason: mysqlEnum('reason', VerificationReason).notNull(),
});

export const courts = mysqlTable('courts', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  attribute: varchar('attribute', { length: 255 }).notNull(),
});

export const districts = mysqlTable('districts', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  courtId: int('court_id')
    .notNull()
    .references(() => courts.id),
});

export const schedules = mysqlTable('schedules', {
  id: int('id').primaryKey().autoincrement(),
  notaryId: int('notary_id').references(() => users.id),
  notaryName: varchar('notary_name', { length: 255 }).notNull(),
  secondaryNotaryId: int('secondary_notary_id').references(() => users.id),
  secondaryNotaryName: varchar('secondary_notary_name', {
    length: 255,
  }).notNull(),
  courtId: int('court_id')
    .notNull()
    .references(() => courts.id),
  pattern: varchar('pattern', { length: 255 }).notNull(),
});

export const phases = mysqlTable('phases', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
});

export const proceedings = mysqlTable('proceedings', {
  id: int('id').primaryKey().autoincrement(),
  proceedingNumber: varchar('proceedings_number', { length: 255 }).notNull(),
  deceasedDateOfBirth: date('deceased_date_of_birth').notNull(),
  deceasedDateOfDeath: date('deceased_date_of_death').notNull(),
  deceasedFirstName: varchar('deceased_first_name', { length: 255 }).notNull(),
  deceasedLastName: varchar('deceased_last_name', { length: 255 }).notNull(),
  deceasedStreetWithNumber: varchar('deceased_address', {
    length: 255,
  }).notNull(),
  deceasedCity: varchar('deceased_city', { length: 255 }).notNull(),
  deceasedDistrict: varchar('deceased_district', { length: 255 }).notNull(),
  deceasedPostalCode: varchar('deceased_postal_code', {
    length: 255,
  }).notNull(),
  deceasedSex: varchar('sex', { length: 255 }),
  phaseId: int('phase_id')
    .notNull()
    .references(() => phases.id)
    .default(1),
  startDate: date('start_date').notNull(),
  notaryId: int('notary_id').references(() => users.id),
});

export const participants = mysqlTable('participants', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .notNull()
    .references(() => users.id),
  proceedingId: int('proceeding_id')
    .notNull()
    .references(() => proceedings.id, {
      onDelete: 'cascade',
    }),
  participantStateId: int('participant_state_id').references(
    () => participantStates.id,
  ),
});

export const participantStates = mysqlTable('participant_states', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
});

export const participantInvitations = mysqlTable('participant_invitations', {
  id: int('id').primaryKey().autoincrement(),

  proceedingId: int('proceeding_id')
    .notNull()
    .references(() => proceedings.id, {
      onDelete: 'cascade',
    }),

  participantEmail: varchar('participant_email', { length: 255 }).notNull(),
  participantFirstname: varchar('participant_firstname', {
    length: 255,
  }).notNull(),
  participantLastname: varchar('participant_lastname', {
    length: 255,
  }).notNull(),

  token: varchar('token', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

const MeetingType: [string, ...string[]] = ['online', 'in_person'];

export const meetings = mysqlTable('meetings', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  type: mysqlEnum('type', MeetingType).notNull(),
  startDateTime: datetime('start_date_time').notNull(),
  userId: int('user_id').references(() => users.id),
  proceedingId: int('proceeding_id').references(() => proceedings.id, {
    onDelete: 'cascade',
  }),
});

const FileType: [string, ...string[]] = ['pdf', 'docx'];

export const files = mysqlTable('files', {
  id: int('id').primaryKey().autoincrement(),
  path: varchar('path', { length: 255 }).notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  alias: varchar('alias', { length: 255 }).notNull(),
  type: mysqlEnum('type', FileType).notNull(),
  proceedingId: int('proceeding_id')
    .references(() => proceedings.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const messages = mysqlTable('messages', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id')
    .references(() => users.id)
    .notNull(),
  proceedingId: int('proceeding_id')
    .references(() => proceedings.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  text: varchar('text', { length: 4096 }).notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export const taskStates = mysqlTable('task_states', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
});

export const tasks = mysqlTable('tasks', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  taskStateId: int('task_state_id').references(() => taskStates.id),
  fileId: int('file_id').references(() => files.id),
  textAnswer: varchar('text_answer', { length: 1024 }),
  proceedingId: int('proceeding_id').references(() => proceedings.id, {
    onDelete: 'cascade',
  }),
});
