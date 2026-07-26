"use client";

import React, { useState, useEffect } from 'react';
import { formatEditorialTime, formatAbsolute, TimeContext } from '@/lib/time/editorial';

interface EditorialTimeProps {
  date: Date | string | number;
  context?: TimeContext;
  action?: string;
  className?: string;
}

export function EditorialTime({ date, context = 'feed', action, className = '' }: EditorialTimeProps) {
  const dateObj = new Date(date);
  
  // We initialize state with the exact same output the server will generate
  // to avoid React hydration mismatch errors.
  const [displayTime, setDisplayTime] = useState(() => 
    formatEditorialTime(dateObj, { context, action })
  );

  useEffect(() => {
    // Re-calculate immediately on client mount to correct any server/client time drift
    setDisplayTime(formatEditorialTime(dateObj, { context, action }));

    const ageInMs = Date.now() - dateObj.getTime();
    
    // Only set up a ticking interval if the date is less than 24 hours old.
    // Older dates (like "Yesterday" or "March 14") do not need minute-by-minute updates.
    if (ageInMs > 24 * 60 * 60 * 1000) return;

    // Update every 30 seconds for highly accurate "Just now" -> "1 min ago" transitions
    const interval = setInterval(() => {
      setDisplayTime(formatEditorialTime(dateObj, { context, action }));
    }, 30000);

    return () => clearInterval(interval);
  }, [date, context, action]);

  const absoluteString = formatAbsolute(dateObj);
  const ariaLabel = action ? `${action} ${absoluteString}` : absoluteString;

  // suppressHydrationWarning ensures that if the server renders "Just now" 
  // but the client immediately calculates "1 min ago" during hydration, 
  // React will silently patch the text node without throwing a console error.
  return (
    <time 
      dateTime={dateObj.toISOString()} 
      title={absoluteString}
      aria-label={ariaLabel}
      className={className}
      suppressHydrationWarning
    >
      {displayTime}
    </time>
  );
}
