import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import issueRoutes from './routes/issues';
import departmentRoutes from './routes/departments';
import taskRoutes from './routes/tasks';
import analyticsRoutes from './routes/analytics';
import savedViewsRoutes from './routes/saved-views';
import userRoutes from './routes/users';
import settingsRoutes from './routes/settings';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or server-to-server fetches)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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
const healthHandler = (req: express.Request, res: express.Response) => {
  res.json({
    status: 'online',
    service: 'CivicPulse Smart City Infrastructure API',
    timestamp: new Date().toISOString(),
  });
};
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/saved-views', savedViewsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);

// Export for serverless or testing
export default app;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
  (module.exports as any).default = app;
}

const isServerless = process.env.VERCEL === '1' || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) || Boolean(process.env.VERCEL_ENV);
if (process.env.NODE_ENV !== 'test' && !isServerless && typeof require !== 'undefined' && require.main === module) {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🏛️ CivicPulse Backend API server running on http://localhost:${PORT}`);
  });
}
