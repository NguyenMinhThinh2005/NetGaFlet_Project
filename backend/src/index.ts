import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import searchRoutes from './routes/searchRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// =========================================================================
// Middleware
// =========================================================================
app.use(cors());
app.use(express.json());

// =========================================================================
// Routes
// =========================================================================
app.use('/api/search', searchRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =========================================================================
// Start server
// =========================================================================
app.listen(PORT, () => {
  console.log(`🚀 NetGaFlex Backend running on http://localhost:${PORT}`);
  console.log(`   POST /api/search/semantic`);
  console.log(`   POST /api/search/index-movie`);
});
