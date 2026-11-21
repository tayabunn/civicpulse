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

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(
  cors({
    origin: [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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

// Export for serverless or testing
export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🏛️ CivicPulse Backend API server running on http://localhost:${PORT}`);
  });
}
