"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const auth_1 = __importDefault(require("./routes/auth"));
const issues_1 = __importDefault(require("./routes/issues"));
const departments_1 = __importDefault(require("./routes/departments"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const saved_views_1 = __importDefault(require("./routes/saved-views"));
const users_1 = __importDefault(require("./routes/users"));
const settings_1 = __importDefault(require("./routes/settings"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
// Middleware
const allowedOrigins = [
    FRONTEND_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5000',
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (such as mobile apps, curl, or server-to-server fetches)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) ||
            origin.endsWith('.vercel.app') ||
            process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Root route for API discovery & health
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'CivicPulse Smart City Infrastructure API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: '/api/auth',
            issues: '/api/issues',
            departments: '/api/departments',
            tasks: '/api/tasks',
            analytics: '/api/analytics',
        },
        timestamp: new Date().toISOString(),
    });
});
// Healthcheck
const healthHandler = (req, res) => {
    res.json({
        status: 'online',
        service: 'CivicPulse Smart City Infrastructure API',
        timestamp: new Date().toISOString(),
    });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/issues', issues_1.default);
app.use('/api/departments', departments_1.default);
app.use('/api/tasks', tasks_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/saved-views', saved_views_1.default);
app.use('/api/users', users_1.default);
app.use('/api/settings', settings_1.default);
// Export for serverless or testing
exports.default = app;
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
    module.exports.default = app;
}
const isServerless = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) || Boolean(process.env.VERCEL_ENV);
if (process.env.NODE_ENV !== 'test' && !isServerless && typeof require !== 'undefined' && require.main === module) {
    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`🏛️ CivicPulse Backend API server running on http://localhost:${PORT}`);
    });
}
