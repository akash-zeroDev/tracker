'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LiveFooter } from './LiveFooter';

export function TopIndex() {
  const [timeStr, setTimeStr] = useState<string>('');
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' 
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit', minute: '2-digit'
      };
      // e.g., "Sat 25 Jul 2026 · 03:35 PM"
      const formattedDate = now.toLocaleDateString('en-US', dateOptions).replace(/,/g, '');
      const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
      setTimeStr(`${formattedDate} · ${formattedTime}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000); // update every 10s
    return () => clearInterval(interval);
  }, []);

  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const tabs = [
    { label: "Desk", active: pathname === "/", href: "/" },
    { label: "Community", active: pathname === "/community", href: "/community" },
    { label: "Entries", active: pathname === "/entries", href: "/entries" },
    { label: "Goals", active: false },
    { label: "Archive", active: false },
  ];
  return (
    <header className="border-b border-[color:var(--color-rule)] bg-[color:var(--color-paper)]/70 backdrop-blur-[1px]">
      <div className="mx-auto flex max-w-[1180px] items-end justify-between px-8 pt-8 pb-0">
        <div className="flex items-baseline gap-4 md:gap-6 mb-3">
          <span className="ref-id whitespace-nowrap">SYNC · Vol.{currentYear}</span>
          <h1 className="font-serif text-[1.45rem] tracking-tight ml-2 md:ml-4">
            <Link href="/" className="cursor-pointer transition-colors hover:text-[color:var(--color-burgundy)]">
              Sync
            </Link>
          </h1>
          <span className="ref-id hidden lg:inline whitespace-nowrap overflow-hidden text-ellipsis">
            {timeStr || 'est. MMXXI'}
          </span>
        </div>
        <nav className="flex items-end gap-1">
          {tabs.map((t) => {
            const className = (t.active ? "index-tab index-tab-active" : "index-tab tab-lift") + (t.href ? " cursor-pointer" : " cursor-default");
            if (t.href) {
              return (
                <Link href={t.href} key={t.label} className={className}>
                  {t.label}
                </Link>
              );
            }
            return (
              <span key={t.label} className={className}>
                {t.label}
              </span>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function Colophon() {
  return <LiveFooter />;
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="label-caps">{children}</span>;
}

function Stamp({ children }: { children: React.ReactNode }) {
  return <span className="archive-stamp">{children}</span>;
}

function RefId({ children }: { children: React.ReactNode }) {
  return <span className="ref-id">{children}</span>;
}
