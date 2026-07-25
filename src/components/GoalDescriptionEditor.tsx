'use client';

import React, { useState, useRef, useEffect } from 'react';
import { updateGoalDescription } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Edit2, Loader2, Check } from 'lucide-react';

interface GoalDescriptionEditorProps {
  goalId: string;
  initialDescription: string | null;
}

export function GoalDescriptionEditor({ goalId, initialDescription }: GoalDescriptionEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(initialDescription || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const defaultText = "The Streak is bound like a signature in a book — one thread per day, stitched through the spine. Missed days are visible; the book still holds.";

  const displayDescription = initialDescription || defaultText;

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    }
  }, [isEditing]);

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMsg(null);
    try {
      await updateGoalDescription(goalId, description);
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update description:', error);
      setErrorMsg('Failed to save. If you just migrated the database, please restart your dev server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
    if (e.key === 'Escape') {
      setDescription(initialDescription || '');
      setErrorMsg(null);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="mt-6 max-w-[38ch] flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          className="w-full min-h-[120px] resize-y bg-transparent p-3 font-serif text-[0.98rem] leading-[1.75] text-[color:var(--color-ink)] border border-[color:var(--color-rule)] focus:border-[color:var(--color-ink)] focus:outline-none rounded-md transition-colors disabled:opacity-50 break-words"
          placeholder="Describe your learning goal... (Cmd+Enter to save)"
        />
        {errorMsg && (
          <div className="text-xs text-red-600 font-mono tracking-wide">
            {errorMsg}
          </div>
        )}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setDescription(initialDescription || '');
              setErrorMsg(null);
              setIsEditing(false);
            }}
            disabled={isSaving}
            className="text-xs font-mono uppercase tracking-wider text-[color:var(--color-ink-soft)] hover:text-[color:var(--color-ink)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1 rounded bg-[color:var(--color-ink)] px-2 py-1 text-xs font-mono uppercase tracking-wider text-[color:var(--color-paper)] hover:opacity-90"
          >
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative mt-6 max-w-[38ch] cursor-pointer rounded-md p-1 -ml-1 transition-colors hover:bg-[color:var(--color-rule)]/30"
      onClick={() => {
        setDescription(initialDescription || '');
        setIsEditing(true);
      }}
    >
      <p className="font-serif text-[0.98rem] leading-[1.75] text-[color:var(--color-ink-soft)] whitespace-pre-wrap">
        {displayDescription}
      </p>
      <div className="absolute -left-6 top-1.5 opacity-0 transition-opacity group-hover:opacity-100 text-[color:var(--color-ink-soft)]">
        <Edit2 className="h-4 w-4" />
      </div>
    </div>
  );
}
