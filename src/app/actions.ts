"use server";

import { PrismaClient } from "@prisma/client";
import { formatInTimeZone } from "date-fns-tz";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Generate a random slug for the public URL
function generateSlug(title: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${base}-${randomStr}`;
}

export async function createGoal(title: string) {
  if (!title || title.trim() === "") {
    throw new Error("Title is required");
  }

  const publicSlug = generateSlug(title);

  const goal = await prisma.goal.create({
    data: {
      title: title.trim(),
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

export async function addLogEntry(goalId: string, content?: string, clientTimezone?: string) {
  // Validate timezone is a valid IANA string to prevent errors
  let tz = clientTimezone || 'UTC';
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
  } catch (e) {
    tz = 'UTC'; // Fallback
  }

  // 1. Get current time and project it into the user's local timezone as YYYY-MM-DD
  const now = new Date();
  const currentLocalDateStr = formatInTimeZone(now, tz, 'yyyy-MM-dd');

  // 2. Interactive Transaction with Pessimistic Row Lock
  return await prisma.$transaction(async (tx) => {
    
    // Explicit row-level lock (Requires PostgreSQL)
    const goals = await tx.$queryRaw<any[]>`
      SELECT * FROM "Goal" WHERE id = ${goalId} FOR UPDATE
    `;
    
    if (!goals || goals.length === 0) throw new Error("Goal not found");
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
    const updatedGoal = await tx.goal.update({
      where: { id: goalId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastLogDateText: currentLocalDateStr, // Cache the date of this action
      }
    });

    const entry = await tx.logEntry.create({
      data: {
        goalId,
        content: content?.trim() || null,
      }
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
    },
  });
}

export async function sendBackupEmail(email: string, editUrl: string) {
  try {
    // Create reusable transporter object using real SMTP credentials
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Streak Tracker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Streak Tracker Backup Link",
      html: `<p>Here is your secret edit link. Keep it safe!</p><a href="${editUrl}">${editUrl}</a>`,
    });

    console.log(`[FIRE & FORGET] Email actually dispatched to ${email} with link ${editUrl}`);
    
    return { success: true };
  } catch (error: any) {
    console.error('[NODEMAILER ERROR]', error);
    throw new Error(error.message);
  }
}
