'use client';

import React, { useEffect } from 'react';
import { AppContainer, Section, Stack } from '@/components/ui/layout';
import { Heading, Body } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled exception:', error);
    // Write error to local API or just alert it if we were in a browser, but here we can just log it
    // Wait, since we are in the browser, we can't write to fs directly.
    fetch('/api/log-error?msg=' + encodeURIComponent(error.message + '\\n' + error.stack));
  }, [error]);

  return (
    <main className="flex min-h-[50vh] flex-col items-center justify-center">
      <AppContainer className="max-w-xl text-center">
        <Section className="flex flex-col items-center gap-8 py-12">
          <Stack className="gap-4 items-center">
            <Heading level={2} className="uppercase tracking-widest text-[var(--color-critical)]">
              SYSTEM FRACTURE
            </Heading>
            <Body className="text-[var(--color-foreground)] max-w-md">
              An unexpected anomaly interrupted the sequence. No coordinates were corrupted.
            </Body>
          </Stack>
          
          <Button variant="secondary" onClick={() => reset()} className="tracking-widest font-bold">
            REINITIALIZE
          </Button>
        </Section>
      </AppContainer>
    </main>
  );
}
