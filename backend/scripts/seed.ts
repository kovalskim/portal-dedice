import { getConnection } from '../src/db/db';
import {
  courts,
  districts,
  phases,
  proceedings,
  roles,
  schedules,
  users,
} from '../src/db/schema';

import { courtsData } from './data/courts';
import { districtsData } from './data/districts';
import { schedulesData } from './data/schedules';

async function seed() {
  console.log('Starting seed function');
  const connection = await getConnection();
  const db = connection.db;
  console.log('Database connection established');

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

    // delete proceedings
    await db.delete(proceedings);

    // remove values from phases table
    await db.delete(phases);

    if ((await db.select().from(phases)).length === 0) {
      console.log('No phases found, inserting sample phases');
      // @ts-ignore
      await db.insert(phases).values([
        { id: 1, title: 'probíhající', description: 'Řízení probíhá...' },
        { id: 2, title: 'ukončeno', description: 'Řízení bilo ukončeno' },
      ]);
      console.log('Sample phases inserted');
    }

    if ((await db.select().from(users)).length === 0) {
      console.log('No users found, inserting sample users');
      // @ts-ignore
      await db.insert(users).values([
        {
          id: 1,
          roleId: 1,
          beforeTitle: 'Mr.',
          firstname: 'Young',
          lastname: 'Gatchell',
          afterTitle: null,
          email: 'yg123@quacker.cz',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$2WbGklNQBpoqvGGU++ZbVw$QqmS8jPchj+f3n8BvxSrrsuaIEaVs75Ohx2FzkEl+Y8',
          isVerified: true,
        },
        {
          id: 2,
          roleId: 2,
          beforeTitle: 'Ms.',
          firstname: 'Gatchell',
          lastname: 'Young',
          afterTitle: null,
          email: 'gyoung@quacker.cz',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$2WbGklNQBpoqvGGU++ZbVw$QqmS8jPchj+f3n8BvxSrrsuaIEaVs75Ohx2FzkEl+Y8',
          isVerified: false,
        },
        {
          id: 3,
          roleId: 3,
          beforeTitle: 'Dr.',
          firstname: 'Mitchel',
          lastname: 'Old',
          afterTitle: 'PhD',
          email: 'oldmit@quacker.cz',
          password:
            '$argon2id$v=19$m=65536,t=3,p=4$2WbGklNQBpoqvGGU++ZbVw$QqmS8jPchj+f3n8BvxSrrsuaIEaVs75Ohx2FzkEl+Y8',
          isVerified: false,
        },
      ]);
      console.log('Sample users inserted');
    } else {
      console.log('Users already exist, skipping seed');
    }
    console.log('Deleting tables');
    await db.delete(schedules);
    await db.delete(districts);
    await db.delete(courts);
    console.log('Tables deleted');

    console.log('Inserting courts');
    await db.insert(courts).values(courtsData);

    console.log('Inserting districts');
    await db.insert(districts).values(districtsData);

    console.log('Inserting schedules');
    await db.insert(schedules).values(schedulesData);
    console.log('Seed function completed');
    console.log('Seed function completed');
  } finally {
    await connection.connection.end();
  }
}

seed().catch((err) => {
  console.error('Error in seed function:', err);
  process.exit(1);
});
