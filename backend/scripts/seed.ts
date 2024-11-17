import { getConnection } from '../src/db/db';
import {
  courts,
  districts,
  files,
  meetings,
  messages,
  participants,
  participantStates,
  phases,
  proceedings,
  roles,
  schedules,
  tasks,
  taskStates,
  users,
  verificationTokens,
} from '../src/db/schema';

import { courtsData } from './data/courts';
import { districtsData } from './data/districts';
import { proceedingsData } from './data/proceedings';
import { schedulesData } from './data/schedules';

async function seed() {
  console.log('Starting seed function');
  const connection = await getConnection();
  const db = connection.db;
  console.log('Database connection established');

  console.log('Deleting tables');
  await db.delete(participants);
  await db.delete(participantStates);
  await db.delete(verificationTokens);
  await db.delete(districts);
  await db.delete(schedules);
  await db.delete(messages);
  await db.delete(proceedings);
  await db.delete(phases);
  await db.delete(meetings);
  await db.delete(files);
  await db.delete(taskStates);
  await db.delete(tasks);
  await db.delete(courts);
  await db.delete(users);
  await db.delete(roles);

  try {
    if ((await db.select().from(roles)).length === 0) {
      console.log('No roles found, inserting sample roles');
      // @ts-ignore
      await db.insert(roles).values([
        { id: 1, name: 'admin' },
        { id: 2, name: 'user' },
        { id: 3, name: 'notary' },
      ]);
      console.log('Sample roles inserted');
    } else {
      console.log('Roles already exist, skipping role seed');
    }

    if ((await db.select().from(users)).length === 0) {
      console.log('No users found, inserting sample users');
      // @ts-ignore
      await db.insert(users).values([
        {
          id: 1,
          roleId: 1,
          beforeTitle: null,
          firstname: 'Jan',
          lastname: 'Nový',
          afterTitle: null,
          email: 'jnovy@email.cz',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$2WbGklNQBpoqvGGU++ZbVw$QqmS8jPchj+f3n8BvxSrrsuaIEaVs75Ohx2FzkEl+Y8',
          isVerified: true,
        },
        {
          id: 2,
          roleId: 2,
          beforeTitle: 'Bc.',
          firstname: 'Petra',
          lastname: 'Stará',
          afterTitle: null,
          email: 'pstara@email.cz',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$2WbGklNQBpoqvGGU++ZbVw$QqmS8jPchj+f3n8BvxSrrsuaIEaVs75Ohx2FzkEl+Y8',
          isVerified: true,
        },
        {
          id: 3,
          roleId: 3,
          beforeTitle: 'JUDr.',
          firstname: 'Alfons',
          lastname: 'Notárič',
          afterTitle: '',
          email: 'anotaric@email.cz',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$2WbGklNQBpoqvGGU++ZbVw$QqmS8jPchj+f3n8BvxSrrsuaIEaVs75Ohx2FzkEl+Y8',
          isVerified: true,
        },
      ]);
      console.log('Sample users inserted');
    } else {
      console.log('Users already exist, skipping seed');
    }

    console.log('Inserting courts');
    await db.insert(courts).values(courtsData);

    console.log('Inserting districts');
    await db.insert(districts).values(districtsData);

    console.log('Inserting schedules');
    await db.insert(schedules).values(schedulesData);

    if ((await db.select().from(phases)).length === 0) {
      console.log('No phases found, inserting sample phases');
      // @ts-ignore
      await db.insert(phases).values([
        { id: 1, title: 'Úvodní fáze', description: '...' },
        { id: 2, title: 'Předběžné šetření', description: '...' },
        { id: 3, title: 'Pozůstalostní řízení', description: '...' },
        { id: 4, title: 'Ukončené', description: '...' },
      ]);
      console.log('Sample phases inserted');
    }

    console.log('Inserting proceedings');
    await db.insert(proceedings).values(proceedingsData);

    console.log('Inserting participant states');
    await db.insert(participantStates).values([
      { id: 1, title: 'Čeká na schválení' },
      { id: 2, title: 'Schválený' },
      { id: 3, title: 'Zamítnutý' },
    ]);

    console.log('Inserting proceeding participants');
    await db.insert(participants).values([
      { id: 1, userId: 1, proceedingId: 1, participantStateId: 1 },
      { id: 2, userId: 2, proceedingId: 1, participantStateId: 2 },
    ]);

    console.log('Seed function completed');
  } finally {
    await connection.connection.end();
  }
}

seed().catch((err) => {
  console.error('Error in seed function:', err);
  process.exit(1);
});
