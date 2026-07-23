"use server";

import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function addLogEntry(goalId: string, content?: string) {
  const entry = await prisma.logEntry.create({
    data: {
      goalId,
      content: content?.trim() || null,
    },
  });

  // Increment streak logic could go here, or we can calculate it on the fly
  await prisma.goal.update({
    where: { id: goalId },
    data: { currentStreak: { increment: 1 } },
  });

  return entry;
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
  // In a real production application, this would call Resend, SendGrid, or AWS SES
  // Example with Resend:
  await resend.emails.send({
    from: 'backup@myapp.com',
    to: email,
    subject: 'Your Streak Tracker Backup Link',
    html: `<p>Here is your secret edit link. Keep it safe!</p><a href="${editUrl}">${editUrl}</a>`
  });
  
  // The email is completely fire-and-forget. We do not store it anywhere.
  console.log(`[FIRE & FORGET] Email dispatched to ${email} with link ${editUrl}`);
  
  return { success: true };
}
