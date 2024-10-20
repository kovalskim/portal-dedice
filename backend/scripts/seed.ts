import { getConnection } from '../src/db/db';
import { roles, users } from '../src/db/schema';

async function seed() {
  console.log('Starting seed function');
  const connection = await getConnection();
  const db = connection.db;
  console.log('Database connection established');

  try {
    if ((await db.select().from(roles)).length === 0) {
      console.log('No roles found, inserting sample roles');
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
      await db.insert(users).values([
        {
          id: 1,
          roleId: 1,
          beforeTitle: 'Mr.',
          firstname: 'Young',
          lastname: 'Gatchell',
          afterTitle: null,
          email: 'yg123@quacker.cz',
          password: 'notHashedPassword1',
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
          password: 'notHashedPassword2',
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
          password: 'notHashedPassword3',
          isVerified: false,
        },
      ]);
      console.log('Sample users inserted');
    } else {
      console.log('Users already exist, skipping seed');
    }
    console.log('Seed function completed');
  } finally {
    await connection.connection.end();
  }
}

seed().catch((err) => {
  console.error('Error in seed function:', err);
  process.exit(1);
});
