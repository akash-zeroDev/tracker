import React from 'react';
import Link from 'next/link';
import { AppContainer, Section, Stack } from '@/components/ui/layout';
import { Heading, Body } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)]">
      <AppContainer className="max-w-xl text-center">
        <Section className="flex flex-col items-center gap-8 py-12">
          <Stack className="gap-4 items-center">
            <Heading level={2} className="uppercase tracking-widest text-[var(--color-critical)]">
              COORDINATES INVALID
            </Heading>
            <Body className="text-[var(--color-foreground)] max-w-md">
              This link is malformed or the Tracker has been permanently destroyed.
            </Body>
          </Stack>
          <Link href="/">
            <Button variant="secondary" className="tracking-widest font-bold">
              RETURN TO ORIGIN
            </Button>
          </Link>
        </Section>
      </AppContainer>
    </main>
  );
}
