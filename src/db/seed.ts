import { db } from './index';
import { users, departments, issues, issueActivities, maintenanceTasks } from './schema';
import { generateSeedData } from './mock-data';

export async function runSeed() {
  console.log('🌱 Starting CivicPulse Database Seeding...');

  const data = generateSeedData();

  console.log(`Inserting ${data.departments.length} departments...`);
  for (const dept of data.departments) {
    await db.insert(departments).values(dept).onConflictDoNothing();
  }

  console.log(`Inserting ${data.users.length} users (Admins, Managers, Staff, Citizens)...`);
  for (const user of data.users) {
    await db.insert(users).values(user).onConflictDoNothing();
  }

  console.log(`Inserting ${data.issues.length} municipal infrastructure issues...`);
  for (const issue of data.issues) {
    await db.insert(issues).values(issue).onConflictDoNothing();
  }

  console.log(`Inserting ${data.activities.length} audit trail activity records...`);
  for (const act of data.activities) {
    await db.insert(issueActivities).values(act).onConflictDoNothing();
  }

  console.log(`Inserting ${data.tasks.length} maintenance task records...`);
  for (const task of data.tasks) {
    await db.insert(maintenanceTasks).values(task).onConflictDoNothing();
  }

  console.log('✅ Seeding complete! Database successfully populated with realistic smart city data.');
}

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err);
      process.exit(1);
    });
}
