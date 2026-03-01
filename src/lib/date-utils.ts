/** Parse a date/datetime string as local time to avoid UTC timezone shift */
export const parseLocalDate = (dateStr: string): Date => {
  // UTC datetime strings (e.g. from toISOString()) need native parsing
  // so the browser converts to the correct local date
  if (
    dateStr.includes("T") &&
    (dateStr.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(dateStr))
  ) {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // Date-only or local datetime strings: extract parts directly
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
};
