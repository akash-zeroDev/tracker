import React from 'react';
import { EntriesManuscript } from '@/components/EntriesManuscript';
import { getAllEntries } from '@/app/actions';
import { format } from 'date-fns';

// Helper to calculate raw calendar day differences
function getCalendarDayDifference(previousDate: Date | null, currentDate: Date): number {
  if (!previousDate) return Infinity;
  // Strip time to compare pure UTC dates
  const prevStr = previousDate.toISOString().split('T')[0];
  const currStr = currentDate.toISOString().split('T')[0];
  const prev = new Date(`${prevStr}T00:00:00Z`).getTime();
  const curr = new Date(`${currStr}T00:00:00Z`).getTime();
  const diffTime = Math.abs(curr - prev);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export default async function EntriesPage() {
  const allEntries = await getAllEntries();

  // We need to group entries by goal to compute historical streaks
  const entriesByGoal: Record<string, typeof allEntries> = {};
  allEntries.forEach(entry => {
    if (!entriesByGoal[entry.goalId]) entriesByGoal[entry.goalId] = [];
    entriesByGoal[entry.goalId].push(entry);
  });

  // Sort each goal's entries ascending to compute timeline milestones
  Object.values(entriesByGoal).forEach(list => {
    list.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  });

  const finalRows: any[] = [];
  const monthlyStats: Record<string, { fragments: number, chain: number, mostStudied: string, counts: Record<string, number> }> = {};

  Object.values(entriesByGoal).forEach(goalEntries => {
    let currentStreak = 0;
    let highestStreakReached = 0;
    
    // We will track the indices of the entries that got specific streak tags
    let latestStreakTagIndex = -1;

    goalEntries.forEach((entry, idx) => {
      let specialType = "normal";

      // 1. Calculate streak at this point in time
      const prevEntry = idx > 0 ? goalEntries[idx - 1] : null;
      const dayDiff = getCalendarDayDifference(prevEntry?.createdAt || null, entry.createdAt);
      
      if (dayDiff === 0) {
        // Same day, streak doesn't increase but doesn't break
      } else if (dayDiff === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }

      // 2. Tagging Engine Logic
      if (idx === 0) {
        specialType = "new_subject";
      } else if (dayDiff > 7) {
        specialType = "revival"; // Custom tag for coming back
      } else if (entry.goal.status === "ARCHIVED" && idx === goalEntries.length - 1) {
        specialType = "archived";
      } else if (currentStreak >= 100 && highestStreakReached < 100) {
        specialType = "chain_100";
        highestStreakReached = 100;
        if (latestStreakTagIndex !== -1) finalRows.find(r => r.id === goalEntries[latestStreakTagIndex].id)!.specialType = "normal";
        latestStreakTagIndex = idx;
      } else if (currentStreak >= 50 && highestStreakReached < 50) {
        specialType = "chain_50";
        highestStreakReached = 50;
        if (latestStreakTagIndex !== -1) finalRows.find(r => r.id === goalEntries[latestStreakTagIndex].id)!.specialType = "normal";
        latestStreakTagIndex = idx;
      } else if (currentStreak >= 10 && highestStreakReached < 10) {
        specialType = "chain_10";
        highestStreakReached = 10;
        if (latestStreakTagIndex !== -1) finalRows.find(r => r.id === goalEntries[latestStreakTagIndex].id)!.specialType = "normal";
        latestStreakTagIndex = idx;
      } else if ((entry.content?.length || 0) > 300) {
        specialType = "deep_focus";
      }

      const words = (entry.content || "").split(" ").length;
      const readingTime = Math.max(1, Math.ceil(words / 200)) + " min";

      const monthId = format(entry.createdAt, 'yyyy-MM');
      
      // Update monthly stats
      if (!monthlyStats[monthId]) {
        monthlyStats[monthId] = { fragments: 0, chain: 0, mostStudied: "", counts: {} };
      }
      monthlyStats[monthId].fragments += 1;
      monthlyStats[monthId].chain = Math.max(monthlyStats[monthId].chain, currentStreak);
      
      const cat = entry.goal.category || "Uncategorized";
      monthlyStats[monthId].counts[cat] = (monthlyStats[monthId].counts[cat] || 0) + 1;

      finalRows.push({
        id: entry.id,
        goalId: entry.goalId,
        dateStr: entry.createdAt.toISOString(),
        displayDate: format(entry.createdAt, 'dd MMM'),
        fragment: entry.content || "Empty record.",
        readingTime,
        subject: entry.goal.title,
        category: cat,
        refId: `PA-${entry.goalId.split('-')[0].substring(0, 4).toUpperCase()}`,
        specialType,
        monthId,
        year: format(entry.createdAt, 'yyyy'),
        monthName: format(entry.createdAt, 'MMMM').toUpperCase(),
        timestamp: entry.createdAt.getTime()
      });
    });
  });

  // Calculate Most Studied for each month
  Object.values(monthlyStats).forEach(stat => {
    let top = "";
    let max = 0;
    for (const [cat, count] of Object.entries(stat.counts)) {
      if (count > max) {
        max = count;
        top = cat;
      }
    }
    stat.mostStudied = top;
  });

  // Sort completely by timestamp desc
  finalRows.sort((a, b) => b.timestamp - a.timestamp);

  const archiveStats = {
    fragmentsCount: allEntries.length,
    monthsRecorded: Object.keys(monthlyStats).length,
    activeSubjects: new Set(allEntries.map(e => e.goalId)).size,
    // Finding max streak overall for the header stat
    maxChain: Object.values(monthlyStats).reduce((max, m) => Math.max(max, m.chain), 0)
  };

  return (
    <main className="min-h-screen text-[color:var(--color-ink)] pb-32">
      <EntriesManuscript 
        entries={finalRows} 
        summaries={monthlyStats} 
        archiveStats={archiveStats}
      />
    </main>
  );
}
