import React from "react";
import { getGoalBySlug } from "@/app/actions";
import { notFound } from "next/navigation";
import { Flame } from "lucide-react";

export default async function PublicGoalPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const goal = await getGoalBySlug(params.slug);

  if (!goal) {
    notFound();
  }

  // Simple Heatmap logic: last 7 days for the demo
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const entryDates = new Set(
    goal.entries.map((e) => new Date(e.createdAt).toISOString().split('T')[0])
  );

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-6 sm:p-12 w-full max-w-3xl mx-auto space-y-12 pt-24">
      
      <header className="w-full text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight glow-text">{goal.title}</h1>
        <div className="flex items-center justify-center space-x-2 text-orange-400">
          <Flame className="w-6 h-6" />
          <span className="text-xl font-bold font-mono">{goal.currentStreak} Day Streak</span>
        </div>
      </header>

      <section className="w-full glass-panel p-6">
        <h3 className="text-sm text-white/60 mb-4 font-mono uppercase tracking-wider">Last 7 Days Activity</h3>
        <div className="flex items-center justify-between gap-2">
          {last7Days.map((dateStr, i) => {
            const hasEntry = entryDates.has(dateStr);
            const displayDate = new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short' });
            return (
              <div key={dateStr} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center ${hasEntry ? 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-white/5 border border-white/10'}`}>
                </div>
                <span className="text-[10px] text-white/40">{displayDate}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full space-y-4">
        <h2 className="text-xl font-semibold">Public Log</h2>
        <div className="space-y-4">
          {goal.entries.length === 0 && (
            <p className="text-white/50 text-sm">This creator hasn't logged anything yet.</p>
          )}
          {goal.entries.map((entry) => (
            <div key={entry.id} className="glass-panel p-4">
              <p className="text-sm text-white/60 mb-2">{new Date(entry.createdAt).toLocaleDateString()}</p>
              <p>{entry.content || "Streak continued."}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
