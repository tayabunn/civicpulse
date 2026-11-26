"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const audit_1 = require("../lib/audit");
const router = (0, express_1.Router)();
// In-memory configuration store for City Administration
let systemSettings = {
    cityCorporationName: 'Dhaka North City Corporation (DNCC)',
    platformVersion: 'Signal City 1.0.0',
    duplicateRadarRadiusMeters: 50,
    emergencyEscalationHours: 4,
    autoAssignPriorityIssues: true,
    emailNotificationsEnabled: true,
    smsAlertsEnabled: true,
    slaTargetsHours: {
        critical: 12,
        high: 24,
        medium: 48,
        low: 96,
    },
    workingHours: {
        start: '08:00',
        end: '18:00',
        timezone: 'Asia/Dhaka',
    },
};
// 1. GET /api/settings - Fetch current system configuration (Authenticated users)
router.get('/', auth_1.authenticateToken, (req, res) => {
    return res.json({ success: true, settings: systemSettings });
});
// 2. PATCH /api/settings - Update system configuration (Strict Admin only with Audit Log)
router.patch('/', auth_1.authenticateToken, (0, auth_1.authorizeRole)(['admin']), async (req, res) => {
    try {
        const updates = req.body;
        systemSettings = {
            ...systemSettings,
            ...updates,
            slaTargetsHours: {
                ...systemSettings.slaTargetsHours,
                ...(updates.slaTargetsHours || {}),
            },
            workingHours: {
                ...systemSettings.workingHours,
                ...(updates.workingHours || {}),
            },
        };
        await (0, audit_1.logSecurityAudit)(req, {
            action: 'SYSTEM_SETTINGS_UPDATED',
            resource: 'settings',
            details: updates,
        });
        return res.json({
            success: true,
            message: 'System configuration updated successfully',
            settings: systemSettings,
        });
    }
    catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({ error: 'Failed to update system settings' });
    }
});
exports.default = router;
