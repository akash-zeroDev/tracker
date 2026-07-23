"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Mail, Check, AlertCircle } from "lucide-react";
import { sendBackupEmail } from "@/app/actions";

export function EmailBackupCard({ editUrl }: { editUrl: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Load previous email from localStorage if they've used this feature before
  useEffect(() => {
    const savedEmail = localStorage.getItem("backup_email_v1");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      // Save locally for convenience, NEVER send to Supabase
      localStorage.setItem("backup_email_v1", email);
      
      const fullUrl = `${window.location.origin}${editUrl}`;
      await sendBackupEmail(email, fullUrl);
      
      setStatus("success");
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="glass-panel p-5 space-y-4 relative overflow-hidden border border-blue-500/20">
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50" />
      
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <Mail className="w-4 h-4 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold">Never lose this tracker</h3>
          <p className="text-xs text-white/60 mt-1">
            Want cross-device access? Send a one-time backup link to your inbox.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <Button 
          type="submit" 
          disabled={status === "loading" || status === "success"}
          variant="secondary"
          className="text-sm px-4"
        >
          {status === "loading" ? "Sending..." : status === "success" ? <Check className="w-4 h-4" /> : "Send"}
        </Button>
      </form>

      <div className="flex items-center gap-1.5 text-[10px] text-white/40 pt-1">
        <AlertCircle className="w-3 h-3" />
        <p>Fire-and-forget: Your email is saved to this browser only. We <strong className="text-white/60">never</strong> store it in our database.</p>
      </div>
    </div>
  );
}
