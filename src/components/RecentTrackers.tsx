'use client';
import React from 'react';
import { useTrackers } from '@/hooks/useTrackers';
import { Copy, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { EditorialTime } from '@/components/ui/EditorialTime';
export function RecentTrackers() {
  const { trackers, isLoaded, removeTracker } = useTrackers();
  if (!isLoaded || trackers.length === 0) {
    return null;
  }
  const handleCopyPublic = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
  };
  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Remove this tracker from this browser? (This won't delete it from the server)")) {
      removeTracker(id);
    }
  };
  return (
    <section className="mt-12 flex w-full flex-col space-y-6 border-t border-white/10 pt-12 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-2xl font-bold">Your Recent Trackers</h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/50">
          Local Only
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {trackers.map((tracker) => (
          <Link
            href={`/edit/${tracker.id}`}
            key={tracker.id}
            className="glass-panel group relative flex h-40 flex-col justify-between space-y-4 overflow-hidden p-5 transition-colors hover:border-white/30"
          >
            {}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 transition-colors duration-500 group-hover:from-blue-500/10 group-hover:to-purple-500/10" />
            <div>
              <h3 className="truncate pr-8 text-lg font-semibold">{tracker.title}</h3>
              <EditorialTime 
                date={tracker.lastOpened} 
                context="footer" 
                action="Opened" 
                className="mt-1 block text-xs text-white/50" 
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/5 pt-2">
              <span className="flex items-center gap-1 text-sm text-blue-400 transition-colors group-hover:text-blue-300">
                Edit <ExternalLink className="h-3 w-3" />
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleCopyPublic(e, tracker.slug)}
                  className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                  title="Copy Public Link"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleRemove(e, tracker.id)}
                  className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
                  title="Remove from local history"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
