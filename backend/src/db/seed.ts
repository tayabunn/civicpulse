import { db } from './index';
import { users, departments, issues, issueActivities, maintenanceTasks } from './schema';
import { generateSeedData } from './mock-data';

export async function runSeed() {
  console.log('🌱 Starting CivicPulse Database Seeding on Neon PostgreSQL...');

  const data = generateSeedData();

  console.log(`Inserting ${data.departments.length} departments...`);
  await db.insert(departments).values(data.departments).onConflictDoNothing();

  console.log(`Inserting ${data.users.length} users (Admins, Managers, Staff, Citizens)...`);
  await db.insert(users).values(data.users).onConflictDoNothing();

  console.log(`Inserting ${data.issues.length} municipal infrastructure issues...`);
  // Insert issues in chunks of 30
  for (let i = 0; i < data.issues.length; i += 30) {
    const chunk = data.issues.slice(i, i + 30);
    await db.insert(issues).values(chunk).onConflictDoNothing();
  }

  console.log(`Inserting ${data.activities.length} audit trail activity records...`);
  for (let i = 0; i < data.activities.length; i += 50) {
    const chunk = data.activities.slice(i, i + 50);
    await db.insert(issueActivities).values(chunk).onConflictDoNothing();
  }

  console.log(`Inserting ${data.tasks.length} maintenance task records...`);
  for (let i = 0; i < data.tasks.length; i += 50) {
    const chunk = data.tasks.slice(i, i + 50);
    await db.insert(maintenanceTasks).values(chunk).onConflictDoNothing();
  }

  console.log('✅ Seeding complete! Database successfully populated with realistic smart city data.');
}

runSeed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
