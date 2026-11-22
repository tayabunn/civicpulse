"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const views = await db_1.db
            .select()
            .from(schema_1.savedViews)
            .where((0, drizzle_orm_1.eq)(schema_1.savedViews.userId, user.id));
        return res.json({ views });
    }
    catch (error) {
        console.error('List saved views error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        const { name, filtersJson, sortJson, columnsJson, isShared } = req.body;
        if (!name || !filtersJson) {
            return res.status(400).json({ error: 'Name and filters are required' });
        }
        const [newView] = await db_1.db
            .insert(schema_1.savedViews)
            .values({
            userId: user.id,
            name,
            filtersJson,
            sortJson,
            columnsJson,
            isShared: isShared || false,
        })
            .returning();
        return res.status(201).json({ success: true, view: newView });
    }
    catch (error) {
        console.error('Create saved view error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
