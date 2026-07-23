"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { addLogEntry } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function ClientLogForm({ goalId }: { goalId: string }) {
  const [content, setContent] = useState("");
  const [timezone, setTimezone] = useState("UTC");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const router = useRouter();

  useEffect(() => {
    try {
      setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch (e) {
      // fallback to UTC
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      await addLogEntry(goalId, content, timezone);
      setStatus("success");
      setContent("");
      router.refresh();
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What did you learn today? (Optional)"
        className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
        disabled={status === "loading"}
      />
      <div className="flex justify-end">
        <Button 
          type="submit" 
          variant="primary" 
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? "Saving..." : status === "success" ? <Check className="w-5 h-5 mx-auto" /> : "Save Log"}
        </Button>
      </div>
    </form>
  );
}
