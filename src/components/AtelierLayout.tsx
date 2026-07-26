'use client';
import React, { useState, useEffect } from 'react';
import { Label, RefId, MarginNote } from './AtelierPrimitives';
import { usePathname } from 'next/navigation';
import { ArchivalLink as Link } from '@/components/transitions/ArchivalLink';
import { InkRegion } from '@/components/transitions/InkPrimitives';
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
      const formattedDate = now.toLocaleDateString('en-US', dateOptions).replace(/,/g, '');
      const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
      setTimeStr(`${formattedDate} · ${formattedTime}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000); 
    return () => clearInterval(interval);
  }, []);
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const tabs = [
    { label: "Desk", active: pathname === "/desk", href: "/desk" },
    { label: "Community", active: pathname === "/community", href: "/community" },
    { label: "Entries", active: pathname === "/entries", href: "/entries" },
    { label: "Archive", active: pathname === "/archive", href: "/archive" },
  ];
  return (
    <InkRegion priority={0}>
      <header className="border-b border-[color:var(--color-rule)] bg-[color:var(--color-paper)]/70 backdrop-blur-[1px]">
        <div className="mx-auto flex flex-col md:flex-row md:items-end justify-between max-w-[1180px] px-4 sm:px-8 pt-6 sm:pt-8 pb-0 gap-4 md:gap-0">
          <div className="flex items-baseline gap-3 sm:gap-4 md:gap-6 md:mb-3">
            <span className="ref-id whitespace-nowrap">SYNC · Vol.{currentYear}</span>
            <h1 className="font-serif text-[1.45rem] tracking-tight ml-auto md:ml-4">
              <Link href="/" className="cursor-pointer transition-colors hover:text-[color:var(--color-burgundy)]">
                Sync
              </Link>
            </h1>
            <span className="ref-id hidden lg:inline whitespace-nowrap overflow-hidden text-ellipsis">
              {timeStr || 'est. MMXXI'}
            </span>
          </div>
          <nav className="flex items-end gap-1 overflow-x-auto w-full md:w-auto pb-px flex-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => {
              const className = (t.active ? "index-tab index-tab-active" : "index-tab tab-lift") + (t.href ? " cursor-pointer" : " cursor-default") + " shrink-0";
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
    </InkRegion>
  );
}
export function Colophon() {
  const pathname = usePathname();
  if (pathname.startsWith('/edit')) {
    return null;
  }
  return <LiveFooter />;
}
