"use client";

import React from "react";
import { OmniInput } from "@/components/ui/OmniInput";
import { RecentTrackers } from "@/components/RecentTrackers";
import { ArrowUpRight, BarChart2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { createGoal } from "@/app/actions";

export default function Home() {
  const router = useRouter();

  const handleCreateGoal = async (value: string) => {
    try {
      const goal = await createGoal(value);
      router.push(`/edit/${goal.id}`);
    } catch (error) {
      console.error("Failed to create goal", error);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 w-full max-w-5xl mx-auto space-y-32">
      
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center space-y-8 text-center pt-20">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight glow-text">
            Learn in Public. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Zero Friction.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-mono">
            Log your daily progress, build a streak, and share your journey without ever signing up.
          </p>
        </div>

        <div className="w-full pt-8">
          <OmniInput onSubmitAction={handleCreateGoal} />
        </div>
      </section>

      {/* Recent Trackers (Local Storage) */}
      <RecentTrackers />

      {/* Interactive Preview / How it works */}
      <section className="w-full grid md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold">1. Set a Goal</h3>
          <p className="text-white/60 text-sm">Enter what you are learning right now. No email, no password.</p>
        </div>
        
        <div className="glass-panel p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold">2. Build a Streak</h3>
          <p className="text-white/60 text-sm">Log your daily progress and watch your activity heatmap light up.</p>
        </div>
        
        <div className="glass-panel p-6 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-pink-400" />
          </div>
          <h3 className="text-xl font-semibold">3. Share the Proof</h3>
          <p className="text-white/60 text-sm">Get a secret link to update, and a public link to share on socials.</p>
        </div>
      </section>

    </main>
  );
}
