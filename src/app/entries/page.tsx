'use client';

import React, { useEffect, useState } from 'react';
import { EntriesManuscript } from '@/components/EntriesManuscript';
import { getEntriesByGoalIds } from '@/app/actions';
import { format } from 'date-fns';
import { InkRegion } from '@/components/transitions/InkPrimitives';
import { useTrackers } from '@/hooks/useTrackers';

function getCalendarDayDifference(previousDate: Date | null, currentDate: Date): number {
  if (!previousDate) return Infinity;
  const prevStr = previousDate.toISOString().split('T')[0];
  const currStr = currentDate.toISOString().split('T')[0];
  const prev = new Date(`${prevStr}T00:00:00Z`).getTime();
  const curr = new Date(`${currStr}T00:00:00Z`).getTime();
  const diffTime = Math.abs(curr - prev);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export default function EntriesPage() {
  const { trackers, isLoaded } = useTrackers();
  const [allEntries, setAllEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const ids = trackers.map(t => t.id);
      if (ids.length > 0) {
        getEntriesByGoalIds(ids).then(entries => {
          setAllEntries(entries);
          setIsLoading(false);
        });
      } else {
        setAllEntries([]);
        setIsLoading(false);
      }
    }
  }, [trackers, isLoaded]);

  if (isLoading || !isLoaded) {
    return (
      <main className="min-h-screen text-[color:var(--color-ink)] pb-32 flex items-center justify-center">
        <p className="font-serif italic text-[color:var(--color-ink-soft)]">Loading entries...</p>
      </main>
    );
  }

  const entriesByGoal: Record<string, typeof allEntries> = {};
  allEntries.forEach(entry => {
    if (!entriesByGoal[entry.goalId]) entriesByGoal[entry.goalId] = [];
    entriesByGoal[entry.goalId].push(entry);
  });
  Object.values(entriesByGoal).forEach(list => {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  });
  const finalRows: any[] = [];
  const monthlyStats: Record<string, { fragments: number, chain: number, mostStudied: string, counts: Record<string, number> }> = {};
  Object.values(entriesByGoal).forEach(goalEntries => {
    let currentStreak = 0;
    let highestStreakReached = 0;
    let latestStreakTagIndex = -1;
    goalEntries.forEach((entry, idx) => {
      let specialType = "normal";
      const prevEntry = idx > 0 ? goalEntries[idx - 1] : null;
      const dayDiff = getCalendarDayDifference(prevEntry ? new Date(prevEntry.createdAt) : null, new Date(entry.createdAt));
      if (dayDiff === 0) {
      } else if (dayDiff === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
      if (idx === 0) {
        specialType = "new_subject";
      } else if (dayDiff > 7) {
        specialType = "revival"; 
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
      const monthId = format(new Date(entry.createdAt), 'yyyy-MM');
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
        dateStr: new Date(entry.createdAt).toISOString(),
        displayDate: format(new Date(entry.createdAt), 'dd MMM'),
        fragment: entry.content || "Empty record.",
        readingTime,
        subject: entry.goal.title,
        category: cat,
        refId: `PA-${entry.goalId.split('-')[0].substring(0, 4).toUpperCase()}`,
        specialType,
        monthId,
        year: format(new Date(entry.createdAt), 'yyyy'),
        monthName: format(new Date(entry.createdAt), 'MMMM').toUpperCase(),
        timestamp: new Date(entry.createdAt).getTime()
      });
    });
  });
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
  finalRows.sort((a, b) => b.timestamp - a.timestamp);
  const archiveStats = {
    fragmentsCount: allEntries.length,
    monthsRecorded: Object.keys(monthlyStats).length,
    activeSubjects: new Set(allEntries.map(e => e.goalId)).size,
    maxChain: Object.values(monthlyStats).reduce((max, m) => Math.max(max, m.chain), 0)
  };
  return (
    <main className="min-h-screen text-[color:var(--color-ink)] pb-32">
      <InkRegion priority={2}>
        <EntriesManuscript 
          entries={finalRows} 
          summaries={monthlyStats} 
          archiveStats={archiveStats}
        />
      </InkRegion>
    </main>
  );
}
