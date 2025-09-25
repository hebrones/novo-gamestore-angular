import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const adminPass = await bcrypt.hash('Admin@123', 10);
  const userPass = await bcrypt.hash('User@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@local.com' },
    update: {
      name: 'Admin',
      passwordHash: adminPass,
      role: 'admin',
    },
    create: { name: 'Admin', email: 'admin@local.com', passwordHash: adminPass, role: 'admin' }
  });
  await prisma.user.upsert({
    where: { email: 'user@local.com' },
    update: {
      name: 'User',
      passwordHash: userPass,
      role: 'user',
    },
    create: { name: 'User', email: 'user@local.com', passwordHash: userPass, role: 'user' }
  });

  const seedDir = path.join(__dirname, '..', 'seed_images');
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const products = [
    {"title": "The Witcher 3: Wild Hunt", "description": "RPG épico de mundo aberto com Geralt de Rivia. Uma aventura fantástica repleta de magia e monstros.", "price": 39.99, "stock": 50, "image": "witcher3.jpg"}, 
    {"title": "Cyberpunk 2077", "description": "RPG sci-fi de mundo aberto em Night City. Explore um futuro distópico cheio de tecnologia e perigos.", "price": 59.99, "stock": 35, "image": "cyberpunk2077.jpg"}, 
    {"title": "Grand Theft Auto V", "description": "Aventura de crime em Los Santos. Viva uma vida de crimes e ação em uma cidade vibrante.", "price": 29.99, "stock": 75, "image": "gtav.jpg"}, 
    {"title": "Red Dead Redemption 2", "description": "Aventura épica do velho oeste. Viva como um fora da lei em um mundo selvagem e implacável.", "price": 49.99, "stock": 42, "image": "rdr2.jpg"}, 
    {"title": "Elden Ring", "description": "RPG de ação dark fantasy. Explore um mundo sombrio criado por George R.R. Martin e FromSoftware.", "price": 59.99, "stock": 28, "image": "eldenring.jpg"}, 
    {"title": "God of War", "description": "A jornada mítica de Kratos. Acompanhe o Deus da Guerra em sua nova aventura nórdica.", "price": 39.99, "stock": 33, "image": "godofwar.jpg"}, 
    {"title": "Marvel's Spider-Man", "description": "Balance pelas ruas de Nova York. Seja o Homem-Aranha e proteja a cidade dos vilões.", "price": 49.99, "stock": 30, "image": "spiderman.jpg"}, 
    {"title": "Horizon Zero Dawn", "description": "Cace máquinas em um mundo exuberante. Descubra os segredos de um futuro pós-apocalíptico.", "price": 34.99, "stock": 38, "image": "horizon.jpg"}, 
    {"title": "The Last of Us Part II", "description": "Drama pós-apocalíptico. Uma história emocionante de sobrevivência e vingança.", "price": 39.99, "stock": 25, "image": "lastofus2.jpg"}, 
    {"title": "Ghost of Tsushima", "description": "Mundo aberto samurai. Torne-se um guerreiro lendário no Japão feudal.", "price": 44.99, "stock": 40, "image": "ghostoftsushima.jpg"}
  ];
  for (const p of products) {
    const src = path.join(seedDir, p.image);
    const dest = path.join(uploadDir, p.image);
    if (fs.existsSync(src)) fs.copyFileSync(src, dest);
    await prisma.product.create({
      data: {
        title: p.title, description: p.description, price: p.price, stock: p.stock, imageUrl: `/uploads/${p.image}`
      }
    });
  }
}
main().finally(() => prisma.$disconnect());
