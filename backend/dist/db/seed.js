"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSeed = runSeed;
const index_1 = require("./index");
const schema_1 = require("./schema");
const mock_data_1 = require("./mock-data");
async function runSeed() {
    console.log('🌱 Starting CivicPulse Database Seeding on Neon PostgreSQL...');
    const data = (0, mock_data_1.generateSeedData)();
    console.log(`Inserting ${data.departments.length} departments...`);
    await index_1.db.insert(schema_1.departments).values(data.departments).onConflictDoNothing();
    console.log(`Inserting ${data.users.length} users (Admins, Managers, Staff, Citizens)...`);
    await index_1.db.insert(schema_1.users).values(data.users).onConflictDoNothing();
    console.log(`Inserting ${data.issues.length} municipal infrastructure issues...`);
    // Insert issues in chunks of 30
    for (let i = 0; i < data.issues.length; i += 30) {
        const chunk = data.issues.slice(i, i + 30);
        await index_1.db.insert(schema_1.issues).values(chunk).onConflictDoNothing();
    }
    console.log(`Inserting ${data.activities.length} audit trail activity records...`);
    for (let i = 0; i < data.activities.length; i += 50) {
        const chunk = data.activities.slice(i, i + 50);
        await index_1.db.insert(schema_1.issueActivities).values(chunk).onConflictDoNothing();
    }
    console.log(`Inserting ${data.tasks.length} maintenance task records...`);
    for (let i = 0; i < data.tasks.length; i += 50) {
        const chunk = data.tasks.slice(i, i + 50);
        await index_1.db.insert(schema_1.maintenanceTasks).values(chunk).onConflictDoNothing();
    }
    console.log('✅ Seeding complete! Database successfully populated with realistic smart city data.');
}
runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
