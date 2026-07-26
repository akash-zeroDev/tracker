'use server';

import { PrismaClient } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
const prisma = new PrismaClient();

// Generate a random slug for the public URL
function generateSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomStr}`;
}

const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
});

export async function createGoal(title: string) {
  const parsed = createGoalSchema.parse({ title });
  const validatedTitle = parsed.title.trim();

  const publicSlug = generateSlug(title);

  const goal = await prisma.goal.create({
    data: {
      title: validatedTitle,
      publicSlug,
    },
  });

  return goal;
}

// Helper to calculate raw calendar day differences
function getCalendarDayDifference(previousDateStr: string | null, currentDateStr: string): number {
  if (!previousDateStr) return Infinity; // No previous logs

  // Parse YYYY-MM-DD as strict UTC midnights to avoid ANY local server time offset bugs
  const prev = new Date(`${previousDateStr}T00:00:00Z`).getTime();
  const curr = new Date(`${currentDateStr}T00:00:00Z`).getTime();

  const diffTime = Math.abs(curr - prev);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

const addLogEntrySchema = z.object({
  goalId: z.string().uuid(),
  content: z.string().max(10000).optional().nullable(),
  clientTimezone: z.string().optional().nullable(),
});

export async function addLogEntry(goalId: string, content?: string, clientTimezone?: string) {
  const parsed = addLogEntrySchema.parse({ goalId, content, clientTimezone });
  
  // Validate timezone is a valid IANA string to prevent errors
  let tz = parsed.clientTimezone || 'UTC';
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
  } catch {
    tz = 'UTC'; // Fallback
  }

  // 1. Get current time and project it into the user's local timezone as YYYY-MM-DD
  const now = new Date();
  const currentLocalDateStr = formatInTimeZone(now, tz, 'yyyy-MM-dd');

  // 2. Interactive Transaction with Pessimistic Row Lock
  return await prisma.$transaction(async (tx) => {
    // Explicit row-level lock (Requires PostgreSQL)
    const goals = await tx.$queryRaw<{ id: string; currentStreak: number; longestStreak: number; lastLogDateText: string | null }[]>`
      SELECT * FROM "Goal" WHERE id = ${goalId} FOR UPDATE
    `;

    if (!goals || goals.length === 0) throw new Error('Goal not found');
    const goal = goals[0];

    // 3. Compare Dates
    const dayDiff = getCalendarDayDifference(goal.lastLogDateText, currentLocalDateStr);

    let newStreak = goal.currentStreak;

    if (dayDiff === 0) {
      // Case A: Already logged today -> Do nothing to streak
    } else if (dayDiff === 1) {
      // Case B: Logged yesterday -> Kept streak alive
      newStreak += 1;
    } else {
      // Case C & D: Missed a day or first log -> Reset to 1
      newStreak = 1;
    }

    const newLongestStreak = Math.max(newStreak, goal.longestStreak || 0);

    // 4. Perform Updates
    await tx.goal.update({
      where: { id: goalId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastLogDateText: currentLocalDateStr, // Cache the date of this action
      },
    });

    const entry = await tx.logEntry.create({
      data: {
        goalId: parsed.goalId,
        content: parsed.content?.trim() || null,
      },
    });

    return entry;
  });
}

export async function getGoalBySlug(slug: string) {
  return await prisma.goal.findUnique({
    where: { publicSlug: slug },
    include: {
      entries: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export async function getGoalById(id: string) {
  return await prisma.goal.findUnique({
    where: { id },
    include: {
      entries: {
        orderBy: { createdAt: 'desc' },
      },
      automation: true,
    },
  });
}


const updateDescriptionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().max(1000),
});

export async function updateGoalDescription(id: string, description: string) {
  const parsed = updateDescriptionSchema.parse({ id, description });

  await prisma.goal.update({
    where: { id: parsed.id },
    data: { description: parsed.description.trim() || null },
  });

  return { success: true };
}

export async function toggleGoalVisibility(id: string, isPublic: boolean) {
  await prisma.goal.update({
    where: { id },
    data: { isPublic },
  });
  
  return { success: true };
}

const sendBackupEmailSchema = z.object({
  email: z.string().email(),
  editUrl: z.string().url(),
});

export async function sendBackupEmail(email: string, editUrl: string) {
  try {
    const parsed = sendBackupEmailSchema.parse({ email, editUrl });

    // Create reusable transporter object using real SMTP credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail with defined transport object
    await transporter.sendMail({
      from: `"Streak Tracker" <${process.env.SMTP_USER}>`,
      to: parsed.email,
      subject: 'Your Streak Tracker Backup Link',
      html: `<p>Here is your secret edit link. Keep it safe!</p><a href="${parsed.editUrl}">${parsed.editUrl}</a>`,
    });

    console.log(`[FIRE & FORGET] Email actually dispatched to ${parsed.email} with link ${parsed.editUrl}`);

    return { success: true };
  } catch (error: unknown) {
    console.error('[NODEMAILER ERROR]', error);
    throw new Error((error as Error).message);
  }
}

export async function getRecentGoals(limit: number = 3) {
  return await prisma.goal.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      entries: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });
}

export async function getArchivedGoals() {
  return await prisma.goal.findMany({
    where: { status: 'ARCHIVED' },
    orderBy: { createdAt: 'desc' },
    include: {
      entries: true
    }
  });
}

export async function getCommunityFeed(limit: number = 3) {
  return await prisma.goal.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      entries: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });
}

export async function getArchiveStats() {
  const fragmentsCount = await prisma.logEntry.count();
  const maxStreakResult = await prisma.goal.aggregate({
    _max: {
      longestStreak: true
    }
  });
  const longestChain = maxStreakResult._max.longestStreak || 0;
  const activeFoliosCount = await prisma.goal.count({
    where: { status: 'ACTIVE' }
  });
  const subjectsCount = await prisma.goal.count();
  
  return {
    fragmentsCount,
    longestChain,
    activeFoliosCount,
    subjectsCount,
  };
}

const deleteGoalSchema = z.object({
  id: z.string().uuid(),
});

export async function deleteGoal(id: string) {
  const parsed = deleteGoalSchema.parse({ id });

  await prisma.goal.delete({
    where: { id: parsed.id }
  });
  return { success: true };
}

const deleteLogEntrySchema = z.object({
  id: z.string().min(1),
});

export async function deleteLogEntry(id: string) {
  const parsed = deleteLogEntrySchema.parse({ id });
  
  await prisma.logEntry.delete({
    where: { id: parsed.id }
  });
  
  revalidatePath('/');
  return { success: true };
}

export async function archiveGoal(id: string) {
  await prisma.goal.update({
    where: { id },
    data: { status: 'ARCHIVED' }
  });
  return { success: true };
}

export async function updateGoalCategory(id: string, category: string) {
  await prisma.goal.update({
    where: { id },
    data: { category }
  });
  return { success: true };
}

export async function getAllEntries() {
  return await prisma.logEntry.findMany({
    include: {
      goal: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Command Line Access — Automation Key Management
// Keys are generated with crypto.randomBytes, stored only as SHA-256 hashes.
// The raw key is returned exactly once on generation and never persisted.
// ─────────────────────────────────────────────────────────────────────────────
import { createHash, randomBytes } from 'crypto';

function generateRawKey(): string {
  return 'pa_live_' + randomBytes(24).toString('hex');
}

function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}

/** Enables Command Line Access for a folio. Returns the raw key (shown ONCE). */
export async function enableAutomation(goalId: string): Promise<{ rawKey: string }> {
  const rawKey = generateRawKey();
  const hashed = hashKey(rawKey);
  const prefix = rawKey.slice(0, 16); // "pa_live_XXXXXXXX"

  await prisma.archiveAutomation.upsert({
    where: { goalId },
    update: {
      hashedKey: hashed,
      keyPrefix: prefix,
      isEnabled: true,
      lastUsedAt: null,
      requestCount: 0,
    },
    create: {
      goalId,
      hashedKey: hashed,
      keyPrefix: prefix,
      isEnabled: true,
    },
  });

  revalidatePath(`/edit/${goalId}`);
  return { rawKey };
}

/** Disables (revokes) Command Line Access without deleting the record. */
export async function disableAutomation(goalId: string): Promise<void> {
  await prisma.archiveAutomation.upsert({
    where: { goalId },
    update: { isEnabled: false, hashedKey: null },
    create: { goalId, isEnabled: false },
  });
  revalidatePath(`/edit/${goalId}`);
}

/** Rotates the API key. The old key is immediately invalidated. Returns new raw key (once). */
export async function rotateAutomationKey(goalId: string): Promise<{ rawKey: string }> {
  const rawKey = generateRawKey();
  const hashed = hashKey(rawKey);
  const prefix = rawKey.slice(0, 16);

  await prisma.archiveAutomation.update({
    where: { goalId },
    data: {
      hashedKey: hashed,
      keyPrefix: prefix,
      isEnabled: true,
      requestCount: 0,
      lastUsedAt: null,
    },
  });

  revalidatePath(`/edit/${goalId}`);
  return { rawKey };
}
