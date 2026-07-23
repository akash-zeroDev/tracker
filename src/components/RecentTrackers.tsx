"use client";

import React from "react";
import { useTrackers } from "@/hooks/useTrackers";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
    // In a real app, you'd show a toast here
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Remove this tracker from this browser? (This won't delete it from the server)")) {
      removeTracker(id);
    }
  };

  return (
    <section className="w-full flex flex-col space-y-6 pt-12 pb-8 border-t border-white/10 mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono">Your Recent Trackers</h2>
        <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full border border-white/10">Local Only</span>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trackers.map((tracker) => (
          <Link href={`/edit/${tracker.id}`} key={tracker.id} className="glass-panel p-5 space-y-4 hover:border-white/30 transition-colors group relative overflow-hidden flex flex-col justify-between h-40">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors duration-500 pointer-events-none" />
            
            <div>
              <h3 className="font-semibold text-lg truncate pr-8">{tracker.title}</h3>
              <p className="text-xs text-white/50 mt-1">
                Opened {formatDistanceToNow(tracker.lastOpened, { addSuffix: true })}
              </p>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-sm text-blue-400 flex items-center gap-1 group-hover:text-blue-300 transition-colors">
                Edit <ExternalLink className="w-3 h-3" />
              </span>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleCopyPublic(e, tracker.slug)}
                  className="p-1.5 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  title="Copy Public Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => handleRemove(e, tracker.id)}
                  className="p-1.5 rounded-md hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
                  title="Remove from local history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
