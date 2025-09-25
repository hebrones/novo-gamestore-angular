import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'express-async-errors';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import checkoutRoutes from './routes/checkout';

const app = express();
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/checkout', checkoutRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = Number(process.env.PORT || 3333);
app.listen(port, () => console.log(`API http://localhost:${port}`));
