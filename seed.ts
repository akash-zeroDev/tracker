import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CATEGORIES = ["Software Engineering", "Design", "Writing", "Research", "Reading"];

const MOCK_GOALS = [
  {
    title: "Mastering Database Internals",
    description: "Deep dive into B-Trees, WAL, and MVCC to understand how PostgreSQL actually works under the hood.",
    category: "Software Engineering",
  },
  {
    title: "The Typography Archive",
    description: "Collecting and analyzing beautiful type specimens from mid-century print materials.",
    category: "Design",
  },
  {
    title: "Sci-Fi Novel: The Last City",
    description: "Working on the first draft of my science fiction novel. Target: 1000 words a day.",
    category: "Writing",
  },
  {
    title: "History of the Byzantine Empire",
    description: "Reading through primary sources to understand the fall of Constantinople.",
    category: "Research",
  },
  {
    title: "Understanding React Server Components",
    description: "Building mental models around how RSCs stream HTML over the wire.",
    category: "Software Engineering",
  },
  {
    title: "Meditations by Marcus Aurelius",
    description: "Reading and digesting the classic Stoic text. One chapter per morning.",
    category: "Reading",
  },
  {
    title: "Building an iOS Application",
    description: "Learning Swift and SwiftUI by building a habit tracker.",
    category: "Software Engineering",
  },
  {
    title: "Daily Sketches",
    description: "Practicing anatomy and perspective every single day.",
    category: "Design",
  },
  {
    title: "The Art of Doing Science",
    description: "Essays by Richard Hamming. Taking notes on how to do great research.",
    category: "Reading",
  },
  {
    title: "Learning Rust",
    description: "Rewriting some of my CLI tools in Rust for better performance and safety.",
    category: "Software Engineering",
  }
];

const FRAGMENTS = [
  "Spent two hours today reading about how Write-Ahead Logging guarantees durability even if the power goes out. Fascinating stuff.",
  "Finally wrapped my head around how the page cache works. The OS is doing so much heavy lifting that databases just assume is there.",
  "Found this amazing Swiss poster from 1968. The way they use negative space and strict grid systems is incredibly inspiring.",
  "Sketched out a completely new layout for the dashboard. Removed the borders, relied entirely on typography for hierarchy.",
  "Wrote 1,200 words today. The protagonist finally reaches the underground sector. It feels like the pacing is finally clicking.",
  "Deleted the entire third chapter. It wasn't working. Sometimes you just have to throw things away to find the right path.",
  "Read about the reign of Justinian. The Nika riots were absolutely insane—chariot racing factions basically acting like political parties.",
  "The Hagia Sophia's architectural innovations were driven purely by a desire to show political dominance. Interesting parallel to modern tech.",
  "The biggest mental leap with RSCs is realizing that they don't have access to state. They are literally just functions that return HTML.",
  "Refactored the entire routing layer to use Server Actions. The amount of boilerplate code I was able to delete is staggering.",
  "Book 2 is tough. He really drills down into the idea that other people's opinions are completely worthless. Hard to actually internalize.",
  "\"The obstacle is the way.\" Such a simple concept, but incredibly difficult to apply when you're actually in the middle of a crisis.",
  "Fought with Xcode for three hours today trying to understand how State works in SwiftUI. Finally got the counter to update.",
  "Managed to get CoreData hooked up. It's surprisingly elegant once you understand the property wrappers.",
  "Focused entirely on hands today. Why are hands so difficult to draw? I filled an entire sketchbook page with just thumbs.",
  "Moved on to forced perspective. Trying to draw a cityscape from a low angle. It looks terrible right now, but I'm making progress.",
  "Hamming says you should always have a list of the 10 most important problems in your field, and you should only work on those.",
  "The idea that \"luck favors the prepared mind\" is a cliché, but Hamming gives concrete examples of how you can actually prepare.",
  "The borrow checker finally clicked for me. It's not fighting me, it's just forcing me to actually think about memory lifecycle.",
  "Wrote a small CLI that parses JSON and outputs CSV. It runs literally 10x faster than my old Python script. I am a believer."
];

async function main() {
  console.log('Clearing database...');
  await prisma.logEntry.deleteMany({});
  await prisma.goal.deleteMany({});

  console.log('Database cleared. Seeding new data...');
  
  // Date logic for spreading out entries
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const goalData = MOCK_GOALS[i];
    
    // Generate a random public slug
    const publicSlug = goalData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 8);
    
    // Create goal
    const goal = await prisma.goal.create({
      data: {
        title: goalData.title,
        description: goalData.description,
        category: goalData.category,
        publicSlug,
        status: 'ACTIVE',
        // Start the goal a few days ago
        createdAt: new Date(today.getTime() - (10 - i) * 24 * 60 * 60 * 1000), 
      }
    });

    console.log(`Created Folio: ${goal.title}`);

    // Create 2 entries for each goal
    for (let j = 0; j < 2; j++) {
      const fragment = FRAGMENTS[i * 2 + j];
      const entryDate = new Date(goal.createdAt.getTime() + (j + 1) * 24 * 60 * 60 * 1000);
      
      await prisma.logEntry.create({
        data: {
          goalId: goal.id,
          content: fragment,
          createdAt: entryDate
        }
      });
      
      // Update the goal's streak logic manually for the seed
      await prisma.goal.update({
        where: { id: goal.id },
        data: {
          currentStreak: j + 1,
          longestStreak: j + 1,
          lastLogDateText: entryDate.toISOString().split('T')[0]
        }
      });
    }
  }

  console.log('Seeding complete! 10 Goals and 20 Entries created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
