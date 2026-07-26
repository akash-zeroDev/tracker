'use client';
import React, { useState } from 'react';
import { updateGoalCategory } from '@/app/actions';
const PRESETS = [
  "Software Engineering",
  "Design",
  "Writing",
  "Research",
  "Reading",
  "Other"
];
export function GoalCategoryEditor({ goalId, initialCategory }: { goalId: string, initialCategory: string | null }) {
  const [selected, setSelected] = useState(initialCategory || "");
  const [isSaving, setIsSaving] = useState(false);
  const handleSelect = async (category: string) => {
    if (category === selected) return;
    setSelected(category);
    setIsSaving(true);
    await updateGoalCategory(goalId, category);
    setIsSaving(false);
  };
  return (
    <div className="mt-6 flex flex-wrap gap-2 items-center">
      <span className="label-caps mr-2 opacity-60">Category:</span>
      {PRESETS.map((preset) => (
        <button
          key={preset}
          onClick={() => handleSelect(preset)}
          className={`font-serif text-[0.95rem] transition-colors duration-200 ${
            selected === preset 
              ? "text-[color:var(--color-ink)] border-b border-[color:var(--color-ink)]" 
              : "text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
          }`}
          disabled={isSaving}
        >
          {preset}
        </button>
      ))}
      {isSaving && <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--color-burgundy)] animate-pulse ml-2" />}
    </div>
  );
}
