import { useState, useEffect } from 'react';
export interface LocalTracker {
  id: string; 
  slug: string; 
  title: string;
  createdAt: number;
  lastOpened: number;
}
const STORAGE_KEY = 'streak_trackers_v1';
export function useTrackers() {
  const [trackers, setTrackers] = useState<LocalTracker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTrackers(JSON.parse(stored));
      }
    } catch {
      console.error('Failed to load trackers from localStorage');
    }
    setIsLoaded(true);
  }, []);
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trackers));
    }
  }, [trackers, isLoaded]);
  const addOrUpdateTracker = (tracker: Omit<LocalTracker, 'createdAt' | 'lastOpened'>) => {
    setTrackers((prev) => {
      const existingIndex = prev.findIndex((t) => t.id === tracker.id);
      const now = Date.now();
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...tracker,
          lastOpened: now,
        };
        return updated.sort((a, b) => b.lastOpened - a.lastOpened);
      } else {
        const newTracker: LocalTracker = {
          ...tracker,
          createdAt: now,
          lastOpened: now,
        };
        return [newTracker, ...prev].sort((a, b) => b.lastOpened - a.lastOpened);
      }
    });
  };
  const removeTracker = (id: string) => {
    setTrackers((prev) => prev.filter((t) => t.id !== id));
  };
  return { trackers, isLoaded, addOrUpdateTracker, removeTracker };
}
