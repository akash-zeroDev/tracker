import { differenceInSeconds, differenceInMinutes, differenceInHours, isYesterday, isThisYear, format, differenceInDays } from 'date-fns';
export type TimeContext = 'compact' | 'footer' | 'header' | 'timeline' | 'feed' | 'metadata';
interface FormatOptions {
  context?: TimeContext;
  action?: string; 
}
export function formatEditorialTime(dateInput: Date | string | number, options: FormatOptions = {}): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Unknown date';
  const now = new Date();
  const { context = 'feed', action } = options;
  if (context === 'timeline') {
    return format(date, 'MMMM d, h:mm a');
  }
  if (context === 'metadata') {
    return format(date, 'MMMM d, yyyy');
  }
  if (context === 'header') {
    const actionPrefix = action ? `${action}\n` : '';
    return `${actionPrefix}${format(date, 'MMMM d, yyyy')}`;
  }
  // 2. Relative / Editorial Contexts
  const seconds = differenceInSeconds(now, date);
  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);
  let timeString = '';
  if (seconds < 60) {
    timeString = context === 'compact' ? 'Now' : 'Just now';
  } else if (minutes < 60) {
    timeString = context === 'compact' ? `${minutes}m` : `${minutes} min ago`;
  } else if (hours < 24 && !isYesterday(date)) {
    timeString = context === 'compact' ? `${hours}h` : `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (isYesterday(date)) {
    timeString = 'Yesterday';
  } else if (days < 7) {
    timeString = format(date, 'EEEE'); 
  } else if (isThisYear(date)) {
    timeString = context === 'compact' ? format(date, 'MMM d') : format(date, 'MMMM d'); 
  } else {
    timeString = context === 'compact' ? format(date, 'MMM d, yy') : format(date, 'MMMM d, yyyy');
  }
  if (action && (context === 'footer' || context === 'feed')) {
    return `${action} ${timeString}`;
  }
  return timeString;
}
export function formatAbsolute(dateInput: Date | string | number): string {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  return format(date, 'MMMM d, yyyy, h:mm a');
}
