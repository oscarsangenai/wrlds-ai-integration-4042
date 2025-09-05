import { parseISO, format as formatDate } from 'date-fns';

export const fmt = (iso: string) => {
  try {
    // Handle both full ISO dates and date-only strings
    const dateToFormat = iso.endsWith('Z') || iso.includes('T') ? iso : `${iso}T00:00:00`;
    return formatDate(parseISO(dateToFormat), 'MMMM d, yyyy');
  } catch (error) {
    // Fallback to simple formatting if date-fns fails
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

export const formatDateShort = (iso: string) => {
  try {
    const dateToFormat = iso.endsWith('Z') || iso.includes('T') ? iso : `${iso}T00:00:00`;
    return formatDate(parseISO(dateToFormat), 'MMM d, yyyy');
  } catch (error) {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};