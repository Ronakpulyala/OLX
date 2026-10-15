import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import slugify from 'slugify';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/sell_db',
  entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
  synchronize: true,
});

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Category);

  const categories = [
    { name: 'Cars', icon: 'car' },
    { name: 'Mobiles', icon: 'smartphone' },
    { name: 'Electronics', icon: 'tv' },
    { name: 'Furniture', icon: 'sofa' },
    { name: 'Fashion', icon: 'shirt' },
    { name: 'Books', icon: 'book' },
    { name: 'Sports & Hobbies', icon: 'basketball' },
    { name: 'Bikes & Scooters', icon: 'bike' },
    { name: 'Pets', icon: 'paw' },
    { name: 'Services', icon: 'briefcase' },
    { name: 'Jobs', icon: 'worker' },
    { name: 'Real Estate', icon: 'home' },
  ];

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const existing = await repo.findOne({ where: { slug: slugify(cat.name, { lower: true }) } });
    if (!existing) {
      const newCat = repo.create({
        name: cat.name,
        slug: slugify(cat.name, { lower: true }),
        icon: cat.icon,
        order: i,
      });
      await repo.save(newCat);
      console.log(`Seeded category: ${cat.name}`);
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch(console.error);