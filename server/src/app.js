import cors from 'cors';
import express from 'express';
import caseRoutes from './routes/caseRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '32kb' }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'ai-mystery-room-api' });
});

app.use('/api/cases', caseRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
