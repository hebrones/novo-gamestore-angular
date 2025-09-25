import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.post('/', requireAuth, async (req, res) => {
  const { items } = req.body as { items: { productId: string, quantity: number }[] };
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Empty cart' });

  const ids = items.map(i => i.productId);
  const dbProducts = await prisma.product.findMany({ where: { id: { in: ids } } });
  const mapP = new Map(dbProducts.map(p => [p.id, p]));
  for (const i of items) {
    const p = mapP.get(i.productId);
    if (!p) return res.status(400).json({ message: `Product not found: ${i.productId}` });
    if (i.quantity < 1) return res.status(400).json({ message: 'Invalid quantity' });
    if (p.stock < i.quantity) return res.status(400).json({ message: `Insufficient stock for ${p.title}` });
  }

  const total = items.reduce((sum, i) => sum + (Number(mapP.get(i.productId)!.price) * i.quantity), 0);

  const order = await prisma.order.create({
    data: {
      userId: req.user!.userId,
      total,
      items: {
        create: items.map(i => ({
          productId: i.productId,
          qty: i.quantity,
          priceAtPurchase: mapP.get(i.productId)!.price
        }))
      }
    },
    include: { items: true }
  });

  for (const i of items) {
    await prisma.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.quantity } } });
  }

  res.json({ ok: true, orderId: order.id, total });
});

export default router;
