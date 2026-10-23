import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const defaults = [
    { key: 'site_logo', value: 'images/laslogo1.png' },
    { key: 'site_favicon', value: 'images/favicons.png' },
    { key: 'site_title', value: 'Lascigal Convention Centre | Kalampoor, Muvattupuzha' },
    { key: 'site_description', value: 'Lascigal Convention Centre offers spacious air-conditioned halls, modern audio-visual amenities, dedicated dining, and ample car parking for weddings, corporate summits, and celebrations.' },
  ];

  for (const s of defaults) {
    const existing = await prisma.siteSetting.findUnique({ where: { key: s.key } });
    if (!existing) {
      await prisma.siteSetting.create({ data: s });
      console.log(`Created setting: ${s.key}`);
    } else {
      console.log(`Setting already exists: ${s.key} = ${existing.value}`);
    }
  }

  console.log('Brand settings verified in Supabase!');
  await prisma.$disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
