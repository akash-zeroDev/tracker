import React from 'react';
import { getGoalById } from '@/app/actions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { TrackerSync } from '@/components/TrackerSync';
import EditWorkspaceRedesign from '@/components/EditWorkspaceRedesign';
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
export default async function EditGoalPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const goal = await getGoalById(params.id);
  if (!goal) {
    notFound();
  }
  return (
    <>
      <TrackerSync id={goal.id} slug={goal.publicSlug} title={goal.title} />
      <EditWorkspaceRedesign goal={goal} />
    </>
  );
}
