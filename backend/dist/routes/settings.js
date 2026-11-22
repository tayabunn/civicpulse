"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// In-memory or database configuration store for City Administration
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
// 1. GET /api/settings - Fetch current system configuration
router.get('/', (req, res) => {
    return res.json({ success: true, settings: systemSettings });
});
// 2. PATCH /api/settings - Update system configuration
router.patch('/', (req, res) => {
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
