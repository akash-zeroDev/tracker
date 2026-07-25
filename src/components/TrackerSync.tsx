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
    // We only want to run this once when the tracker is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, id, slug, title]);

  return null; // Silently syncs state in background
}
