"use server";

import prisma from "@/lib/prisma";
import { calculatePatinaScore } from "@/lib/patina/engine";

export async function logPatinaEvent(goalId: string, entryId?: string) {
  try {
    // 1. Process Goal Patina
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { patina: true },
    });

    if (goal) {
      const readCount = (goal.patina?.readCount || 0) + 1;
      const score = calculatePatinaScore(goal.createdAt, readCount);

      await prisma.goalPatina.upsert({
        where: { goalId: goal.id },
        update: {
          readCount: { increment: 1 },
          patinaScore: score,
        },
        create: {
          goalId: goal.id,
          readCount: 1,
          patinaScore: score,
        },
      });
    }

    // 2. Process Entry Patina if provided
    if (entryId) {
      const entry = await prisma.logEntry.findUnique({
        where: { id: entryId },
        include: { patina: true },
      });

      if (entry) {
        const readCount = (entry.patina?.readCount || 0) + 1;
        const score = calculatePatinaScore(entry.createdAt, readCount);

        await prisma.logEntryPatina.upsert({
          where: { entryId: entry.id },
          update: {
            readCount: { increment: 1 },
            patinaScore: score,
          },
          create: {
            entryId: entry.id,
            readCount: 1,
            patinaScore: score,
          },
        });
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Failed to log patina event:", error);
    return { success: false };
  }
}

export async function getGoalPatinaScore(goalId: string): Promise<number> {
  const p = await prisma.goalPatina.findUnique({
    where: { goalId },
    select: { patinaScore: true },
  });
  return p?.patinaScore || 0;
}
