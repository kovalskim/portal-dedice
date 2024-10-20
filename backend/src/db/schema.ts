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
});

const VerificationReason: [string, ...string[]] = [
  'register',
  'password_reset',
  'email_change',
];

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
  notaryId: int('notary_id')
    .notNull()
    .references(() => users.id),
  secondaryNotaryId: int('secondary_notary_id')
    .notNull()
    .references(() => users.id),
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
  phaseId: int('phase_id')
    .notNull()
    .references(() => phases.id),
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
    .references(() => proceedings.id),
});

const MeetingType: [string, ...string[]] = ['online', 'in_person'];

export const meetings = mysqlTable('meetings', {
  id: int('id').primaryKey().autoincrement(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  type: mysqlEnum('type', MeetingType).notNull(),
  startDateTime: datetime('start_date_time').notNull(),
  userId: int('user_id').references(() => users.id),
  proceedingId: int('proceeding_id').references(() => proceedings.id),
});

export const files = mysqlTable('files', {
  id: int('id').primaryKey().autoincrement(),
  path: varchar('path', { length: 255 }).notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  userId: int('user_id').references(() => users.id),
  alias: varchar('alias', { length: 255 }).notNull(),
  proceedingId: int('proceeding_id').references(() => proceedings.id),
});

export const messages = mysqlTable('messages', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').references(() => users.id),
  proceedingId: int('proceeding_id').references(() => proceedings.id),
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
  proceedingId: int('proceeding_id').references(() => proceedings.id),
});
