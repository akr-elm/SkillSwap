import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.exchange.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@skillswap.com',
      password: hashedPassword,
      role: 'ADMIN',
      creditBalance: 100,
    },
  });

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
      creditBalance: 25,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
      creditBalance: 15,
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      password: hashedPassword,
      creditBalance: 30,
    },
  });

  console.log('✅ Created users');

  // Create skills
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        title: 'Web Development with React',
        category: 'Programming',
        level: 'INTERMEDIATE',
        description: 'Learn modern React development including hooks, context, and best practices. Build real-world applications.',
        duration: 10,
        credits: 5,
        ownerId: alice.id,
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Guitar Lessons for Beginners',
        category: 'Music',
        level: 'BEGINNER',
        description: 'Start your musical journey! Learn basic chords, strumming patterns, and play your first songs.',
        duration: 5,
        credits: 3,
        ownerId: bob.id,
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Advanced Python Programming',
        category: 'Programming',
        level: 'ADVANCED',
        description: 'Deep dive into Python: decorators, generators, async/await, design patterns, and performance optimization.',
        duration: 15,
        credits: 8,
        ownerId: charlie.id,
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Digital Photography Basics',
        category: 'Photography',
        level: 'BEGINNER',
        description: 'Master your camera settings, composition rules, and lighting techniques to capture stunning photos.',
        duration: 8,
        credits: 4,
        ownerId: alice.id,
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Spanish Conversation Practice',
        category: 'Languages',
        level: 'INTERMEDIATE',
        description: 'Improve your Spanish speaking skills through real conversations and cultural insights.',
        duration: 6,
        credits: 3,
        ownerId: bob.id,
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Yoga and Meditation',
        category: 'Wellness',
        level: 'BEGINNER',
        description: 'Find balance and peace through guided yoga sessions and meditation techniques.',
        duration: 4,
        credits: 2,
        ownerId: charlie.id,
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Data Science with Python',
        category: 'Programming',
        level: 'ADVANCED',
        description: 'Learn data analysis, visualization, and machine learning using pandas, matplotlib, and scikit-learn.',
        duration: 20,
        credits: 10,
        ownerId: alice.id,
      },
    }),
    prisma.skill.create({
      data: {
        title: 'Cooking Italian Cuisine',
        category: 'Cooking',
        level: 'INTERMEDIATE',
        description: 'Master authentic Italian recipes from pasta to risotto, pizza to tiramisu.',
        duration: 7,
        credits: 4,
        ownerId: bob.id,
      },
    }),
  ]);

  console.log('✅ Created skills');

  // Create some exchanges
  const exchange1 = await prisma.exchange.create({
    data: {
      teacherId: alice.id,
      learnerId: bob.id,
      skillId: skills[0].id, // React
      duration: 10,
      credits: 5,
      status: 'COMPLETED',
    },
  });

  const exchange2 = await prisma.exchange.create({
    data: {
      teacherId: bob.id,
      learnerId: charlie.id,
      skillId: skills[1].id, // Guitar
      duration: 5,
      credits: 3,
      status: 'ACCEPTED',
    },
  });

  await prisma.exchange.create({
    data: {
      teacherId: charlie.id,
      learnerId: alice.id,
      skillId: skills[2].id, // Python
      duration: 15,
      credits: 8,
      status: 'PENDING',
    },
  });

  console.log('✅ Created exchanges');

  // Create reviews
  await prisma.review.create({
    data: {
      exchangeId: exchange1.id,
      skillId: skills[0].id,
      rating: 5,
      comment: 'Excellent teacher! Very patient and knowledgeable. Learned so much about React.',
    },
  });

  await prisma.review.create({
    data: {
      exchangeId: exchange2.id,
      skillId: skills[1].id,
      rating: 4,
      comment: 'Great introduction to guitar. Looking forward to more lessons!',
    },
  });

  console.log('✅ Created reviews');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
