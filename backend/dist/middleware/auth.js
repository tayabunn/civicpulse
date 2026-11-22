"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.authorizeRole = authorizeRole;
const auth_1 = require("../lib/auth");
async function authenticateToken(req, res, next) {
    let token;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }
    else if (req.cookies && req.cookies.civicpulse_session) {
        token = req.cookies.civicpulse_session;
    }
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }
    const user = await (0, auth_1.verifySessionToken)(token);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
    req.user = user;
    next();
}
function authorizeRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
}
