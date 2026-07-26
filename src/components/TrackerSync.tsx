'use client';
import { useEffect } from 'react';
import { useTrackers } from '@/hooks/useTrackers';
interface TrackerSyncProps {
  id: string;
  slug: string;
  title: string;
}
export function TrackerSync({ id, slug, title }: TrackerSyncProps) {
  const { addOrUpdateTracker, isLoaded } = useTrackers();
  useEffect(() => {
    if (isLoaded) {
      addOrUpdateTracker({ id, slug, title });
    }
  }, [isLoaded, id, slug, title, addOrUpdateTracker]);
  return null; 
}
