export function parseDate(duration: string): Date {
  // Handle "YYYY-YYYY" format
  if (/^\d{4}-\d{4}$/.test(duration)) {
    return new Date(parseInt(duration.split('-')[1], 10), 11, 31);
  }
  // Handle "MM/YYYY - MM/YYYY" format
  const match = duration.match(/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{4})/);
  if (match) {
    return new Date(parseInt(match[4], 10), parseInt(match[3], 10) - 1, 1);
  }
  // Handle "YYYY" format
  if (/^\d{4}$/.test(duration)) {
    return new Date(parseInt(duration, 10), 11, 31);
  }
  // Default to current date if format is unrecognized
  return new Date();
}
