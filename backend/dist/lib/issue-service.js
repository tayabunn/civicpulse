"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATEGORY_DEPT_CODE_MAP = void 0;
exports.findNearbyDuplicate = findNearbyDuplicate;
exports.resolveDepartmentForCategory = resolveDepartmentForCategory;
exports.logIssueActivity = logIssueActivity;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const geo_1 = require("./geo");
exports.CATEGORY_DEPT_CODE_MAP = {
    road_damage: 'DEPT-ROAD',
    streetlight: 'DEPT-ELEC',
    drainage: 'DEPT-WATER',
    waste_management: 'DEPT-WASTE',
    footpath: 'DEPT-INFRA',
    public_infrastructure: 'DEPT-INFRA',
};
function findNearbyDuplicate(lat, lon, category, candidateIssues, radiusMeters = 50) {
    for (const issue of candidateIssues) {
        if (issue.category !== category)
            continue;
        if (issue.status === 'closed')
            continue;
        const dist = (0, geo_1.calculateDistanceMeters)(lat, lon, issue.latitude, issue.longitude);
        if (dist <= radiusMeters) {
            return issue;
        }
    }
    return null;
}
async function resolveDepartmentForCategory(category) {
    const code = exports.CATEGORY_DEPT_CODE_MAP[category];
    if (!code)
        return null;
    const [dept] = await db_1.db
        .select({ id: schema_1.departments.id })
        .from(schema_1.departments)
        .where((0, drizzle_orm_1.eq)(schema_1.departments.code, code))
        .limit(1);
    return dept?.id || null;
}
async function logIssueActivity({ issueId, userId, action, previousStatus, newStatus, notes, attachmentUrl, }) {
    return db_1.db.insert(schema_1.issueActivities).values({
        issueId,
        userId,
        action,
        previousStatus,
        newStatus,
        notes: notes || `Action: ${action}`,
        attachmentUrl,
    });
}
