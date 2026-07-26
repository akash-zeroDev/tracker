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
  const [displayTime, setDisplayTime] = useState(() => 
    formatEditorialTime(dateObj, { context, action })
  );
  useEffect(() => {
    setDisplayTime(formatEditorialTime(dateObj, { context, action }));
    const ageInMs = Date.now() - dateObj.getTime();
    if (ageInMs > 24 * 60 * 60 * 1000) return;
    const interval = setInterval(() => {
      setDisplayTime(formatEditorialTime(dateObj, { context, action }));
    }, 30000);
    return () => clearInterval(interval);
  }, [date, context, action]);
  const absoluteString = formatAbsolute(dateObj);
  const ariaLabel = action ? `${action} ${absoluteString}` : absoluteString;
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
