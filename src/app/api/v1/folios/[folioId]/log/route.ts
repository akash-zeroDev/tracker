import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ folioId: string }> }
) {
  try {
    const { folioId } = await params;
    const authHeader = req.headers.get('authorization') ?? '';
    if (!authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or malformed Authorization header. Expected: Bearer <token>' },
        { status: 401 }
      );
    }
    const rawKey = authHeader.slice(7).trim();
    // 2. Hash the incoming key — we NEVER compare raw keys
    const incomingHash = createHash('sha256').update(rawKey).digest('hex');
    const automation = await prisma.archiveAutomation.findUnique({
      where: { goalId: folioId },
    });
    if (!automation || !automation.isEnabled || automation.hashedKey !== incomingHash) {
      return NextResponse.json(
        { error: 'Invalid or revoked API key.' },
        { status: 403 }
      );
    }
    const body = await req.json().catch(() => ({}));
    const content: string = body.content ?? '';
    const timezone: string = body.timezone ?? 'UTC';
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '`content` is required and must be a non-empty string.' },
        { status: 422 }
      );
    }
    const entry = await prisma.logEntry.create({
      data: {
        goalId: folioId,
        content: content.trim(),
      },
    });
    const today = new Date();
    const todayText = today.toLocaleDateString('en-CA', { timeZone: timezone }); 
    const goal = await prisma.goal.findUnique({ where: { id: folioId } });
    if (goal) {
      let newStreak = goal.currentStreak;
      let newLongest = goal.longestStreak;
      if (goal.lastLogDateText !== todayText) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayText = yesterday.toLocaleDateString('en-CA', { timeZone: timezone });
        if (goal.lastLogDateText === yesterdayText) {
          newStreak = goal.currentStreak + 1;
        } else {
          newStreak = 1;
        }
        newLongest = Math.max(newStreak, goal.longestStreak);
      }
      await prisma.goal.update({
        where: { id: folioId },
        data: {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastLogDateText: todayText,
        },
      });
    }
    await prisma.archiveAutomation.update({
      where: { goalId: folioId },
      data: {
        requestCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });
    return NextResponse.json(
      {
        success: true,
        fragment: {
          id: entry.id,
          content: entry.content,
          createdAt: entry.createdAt,
          folioId: entry.goalId,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[API] /api/v1/folios/[folioId]/log error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
