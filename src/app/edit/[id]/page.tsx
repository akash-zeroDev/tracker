import React from "react";
import { getGoalById, addLogEntry } from "@/app/actions";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Copy } from "lucide-react";
import { TrackerSync } from "@/components/TrackerSync";
import { EmailBackupCard } from "@/components/EmailBackupCard";

export default async function EditGoalPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const goal = await getGoalById(params.id);

  if (!goal) {
    notFound();
  }

  return (
    <main className="flex-1 flex flex-col items-center justify-start p-6 sm:p-12 w-full max-w-3xl mx-auto space-y-12 pt-24">
      <TrackerSync id={goal.id} slug={goal.publicSlug} title={goal.title} />
      
      <header className="w-full text-left space-y-4">
        <h1 className="text-3xl font-bold">Editing: {goal.title}</h1>
        
        <div className="glass-panel p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">Your Secret Edit Link (Bookmark this!)</p>
            <code className="text-xs text-purple-300">/edit/{goal.id}</code>
          </div>
          <div>
            <p className="text-sm text-white/60">Public Shareable Link</p>
            <div className="flex items-center space-x-2">
              <code className="text-xs text-blue-300">/{goal.publicSlug}</code>
              <Link href={`/${goal.publicSlug}`} target="_blank">
                <Button variant="secondary" className="h-8 text-xs py-1 px-2">View Public</Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <EmailBackupCard editUrl={`/edit/${goal.id}`} />
        </div>
      </header>

      <section className="w-full space-y-4">
        <h2 className="text-xl font-semibold">Log Today&apos;s Progress</h2>
        <form action={async (formData) => {
          "use server";
          const content = formData.get("content") as string;
          await addLogEntry(goal.id, content);
        }} className="space-y-4">
          <textarea
            name="content"
            placeholder="What did you learn today? (Optional)"
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary">Save Log</Button>
          </div>
        </form>
      </section>

      <section className="w-full space-y-4">
        <h2 className="text-xl font-semibold">Recent Logs</h2>
        <div className="space-y-4">
          {goal.entries.length === 0 && (
            <p className="text-white/50 text-sm">No entries yet. Log something above!</p>
          )}
          {goal.entries.map((entry) => (
            <div key={entry.id} className="glass-panel p-4">
              <p className="text-sm text-white/60 mb-2">{new Date(entry.createdAt).toLocaleDateString()}</p>
              <p>{entry.content || "Logged a streak without notes."}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
