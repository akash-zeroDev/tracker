'use client';
import React, { useEffect } from 'react';
import { AppContainer, Section, Stack } from '@/components/ui/layout';
import { Heading, Body } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global unhandled exception:', error);
  }, [error]);
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center">
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
      </body>
    </html>
  );
}
