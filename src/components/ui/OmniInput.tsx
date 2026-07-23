"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { ArrowRight } from "lucide-react";
import { Button } from "./Button";

export interface OmniInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSubmitAction?: (value: string) => void;
}

export function OmniInput({ className, onSubmitAction, ...props }: OmniInputProps) {
  const [value, setValue] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && onSubmitAction) {
      onSubmitAction(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full max-w-2xl mx-auto group", className)}>
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />
      <div className="relative flex items-center glass-panel p-2 pl-6 rounded-2xl bg-[#0a0a0a]/80">
        <input
          {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent text-xl md:text-2xl outline-none placeholder:text-white/30 text-white"
          placeholder="What are you mastering?"
        />
        <Button 
          type="submit" 
          variant="primary"
          className="ml-2 rounded-xl h-12 w-12 p-0 flex items-center justify-center shrink-0 group-focus-within:bg-white group-focus-within:text-black transition-all"
        >
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </form>
  );
}
