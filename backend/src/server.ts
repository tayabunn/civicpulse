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
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CivicPulse Smart City Infrastructure API',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/saved-views', savedViewsRoutes);

// Export for serverless or testing
export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🏛️ CivicPulse Backend API server running on http://localhost:${PORT}`);
  });
}
