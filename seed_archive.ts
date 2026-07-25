import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ARCHIVED_GOALS = [
  {
    title: "Mastering Database Internals",
    description: "Deeply understood the B-Tree structures and Write-Ahead Logging mechanisms. The OS does a lot of heavy lifting that databases just assume is there.",
    category: "Software Engineering",
    status: "ARCHIVED",
    createdAt: new Date('2025-01-10'),
    longestStreak: 14,
    entries: [
      { content: "Read about B-Trees.", createdAt: new Date('2025-01-11') },
      { content: "Implemented WAL prototype.", createdAt: new Date('2025-01-15') }
    ]
  },
  {
    title: "The Typography Archive",
    description: "Collected and analyzed beautiful type specimens from mid-century print materials. Focus on grid systems and negative space.",
    category: "Design",
    status: "ARCHIVED",
    createdAt: new Date('2025-02-05'),
    longestStreak: 7,
    entries: [
      { content: "Grid systems in graphic design.", createdAt: new Date('2025-02-06') },
      { content: "Studying Helvetica.", createdAt: new Date('2025-02-08') },
      { content: "Negative space balance.", createdAt: new Date('2025-02-12') }
    ]
  },
  {
    title: "Understanding React Server Components",
    description: "Built mental models around how RSCs stream HTML over the wire. The biggest leap is realizing they don't have access to state.",
    category: "Software Engineering",
    status: "ARCHIVED",
    createdAt: new Date('2025-03-20'),
    longestStreak: 12,
    entries: [
      { content: "Setup Next.js app router.", createdAt: new Date('2025-03-21') },
      { content: "Server actions vs APIs.", createdAt: new Date('2025-03-25') }
    ]
  },
  {
    title: "Sci-Fi Novel: The Last City",
    description: "Completed the first draft. The protagonist reached the underground sector. Sometimes you have to throw entire chapters away to find the path.",
    category: "Writing",
    status: "ARCHIVED",
    createdAt: new Date('2025-04-01'),
    longestStreak: 30,
    entries: [
      { content: "Chapter 1 done.", createdAt: new Date('2025-04-02') },
      { content: "Plot twist implemented.", createdAt: new Date('2025-04-15') },
      { content: "Draft finished.", createdAt: new Date('2025-05-30') }
    ]
  },
  {
    title: "History of the Byzantine Empire",
    description: "Read through primary sources to understand the fall of Constantinople. The Nika riots were absolutely insane.",
    category: "Research",
    status: "ARCHIVED",
    createdAt: new Date('2025-06-15'),
    longestStreak: 21,
    entries: [
      { content: "Justinian I background.", createdAt: new Date('2025-06-16') },
      { content: "Nika riots read.", createdAt: new Date('2025-06-20') }
    ]
  },
  {
    title: "Daily Sketches",
    description: "Practiced anatomy and perspective every single day. Filled an entire sketchbook page with just thumbs.",
    category: "Design",
    status: "ARCHIVED",
    createdAt: new Date('2025-07-01'),
    longestStreak: 45,
    entries: [
      { content: "Hands and thumbs.", createdAt: new Date('2025-07-02') },
      { content: "Perspective lines.", createdAt: new Date('2025-07-15') },
      { content: "Full body sketch.", createdAt: new Date('2025-08-01') }
    ]
  }
];

async function main() {
  console.log("Seeding archived goals...");
  for (const goal of ARCHIVED_GOALS) {
    const createdGoal = await prisma.goal.create({
      data: {
        title: goal.title,
        description: goal.description,
        category: goal.category,
        status: "ARCHIVED",
        createdAt: goal.createdAt,
        longestStreak: goal.longestStreak,
        publicSlug: goal.title.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
      }
    });

    for (const entry of goal.entries) {
      await prisma.logEntry.create({
        data: {
          content: entry.content,
          createdAt: entry.createdAt,
          goalId: createdGoal.id,
        }
      });
    }
  }
  console.log("Done seeding archives!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
