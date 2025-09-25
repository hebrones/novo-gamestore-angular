import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAdmin } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', '..', 'uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed'))
});

router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

router.post('/', requireAdmin, async (req, res) => {
  const { title, description, price, stock, imageUrl } = req.body;
  const p = await prisma.product.create({ data: { title, description, price, stock, imageUrl } });
  res.json(p);
});

router.put('/:id', requireAdmin, async (req, res) => {
  const { title, description, price, stock, imageUrl } = req.body;
  const p = await prisma.product.update({ where: { id: req.params.id }, data: { title, description, price, stock, imageUrl } });
  res.json(p);
});

router.delete('/:id', requireAdmin, async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

router.post('/upload', requireAdmin, upload.single('image'), (req, res) => {
  const filename = req.file?.filename;
  if (!filename) return res.status(400).json({ message: 'No file' });
  res.json({ imageUrl: `/uploads/${filename}` });
});

export default router;
