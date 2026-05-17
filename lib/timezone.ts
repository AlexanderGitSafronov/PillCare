const TIMEZONE = "Europe/Kyiv";

function getKyivOffsetMs(date: Date): number {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map(({ type, value }) => [type, value])
  );
  const h = parseInt(parts.hour);
  const kyivMs = Date.UTC(
    parseInt(parts.year),
    parseInt(parts.month) - 1,
    parseInt(parts.day),
    h === 24 ? 0 : h,
    parseInt(parts.minute),
    parseInt(parts.second)
  );
  const dayAdj = h === 24 ? 24 * 60 * 60 * 1000 : 0;
  return kyivMs + dayAdj - date.getTime();
}

/** Returns current date in Kyiv timezone as "YYYY-MM-DD" */
export function getKyivDateStr(date: Date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

/**
 * Converts HH:MM on a given Kyiv date to a UTC Date.
 * kyivDateStr: "YYYY-MM-DD", timeStr: "HH:MM"
 */
export function kyivTimeToUTC(kyivDateStr: string, timeStr: string): Date {
  const [y, mo, d] = kyivDateStr.split("-").map(Number);
  const [h, m] = timeStr.split(":").map(Number);
  // Use noon UTC as safe DST-neutral reference for that date
  const refDate = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  const offsetMs = getKyivOffsetMs(refDate);
  const kyivEpoch = Date.UTC(y, mo - 1, d, h, m, 0);
  return new Date(kyivEpoch - offsetMs);
}

/** Returns start (midnight) and end (23:59:59.999) of a day in UTC, given a Kyiv date string */
export function kyivDayBoundsFromDateStr(kyivDateStr: string): { start: Date; end: Date } {
  const start = kyivTimeToUTC(kyivDateStr, "00:00");
  const end = new Date(kyivTimeToUTC(kyivDateStr, "23:59").getTime() + 59_000 + 999);
  return { start, end };
}

/** Returns start/end UTC bounds for "today" in Kyiv timezone */
export function getKyivDayBoundsUTC(date: Date = new Date()): { start: Date; end: Date } {
  return kyivDayBoundsFromDateStr(getKyivDateStr(date));
}

/** Returns day of week in Kyiv timezone: 0=Mon … 6=Sun */
export function getKyivDayOfWeek(date: Date = new Date()): number {
  const dateStr = getKyivDateStr(date);
  const [y, mo, d] = dateStr.split("-").map(Number);
  const utcDow = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0)).getUTCDay(); // 0=Sun
  return utcDow === 0 ? 6 : utcDow - 1;
}

/** Formats a UTC Date as "HH:mm" in Kyiv timezone */
export function formatKyivTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
