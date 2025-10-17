import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import routes
import ebsRoutes from './routes/ebs';
import edapRoutes from './routes/edap';
import invoicesRoutes from './routes/invoices';
import workflowsRoutes from './routes/workflows';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/ebs', ebsRoutes);
app.use('/api/edap', edapRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/workflows', workflowsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'NF-easy API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 NF-easy Backend running on port ${PORT}`);
});

export default app;
