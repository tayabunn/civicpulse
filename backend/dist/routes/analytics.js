"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_service_1 = require("../lib/analytics-service");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const data = await (0, analytics_service_1.getSystemAnalytics)();
        return res.json(data);
    }
    catch (error) {
        console.error('Analytics error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
