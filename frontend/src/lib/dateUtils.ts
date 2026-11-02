/**
 * Date utility module for standardizing date formatting across the application.
 * Display format: "DD MMM YYYY" (e.g. "30 Oct 2026").
 * Storage / API format: "YYYY-MM-DD".
 */

export const SHORT_MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export interface ISODateParts {
    year: number;
    month: number; // 1-12
    day: number;   // 1-31
}

/**
 * Parses a standard YYYY-MM-DD or ISO date string into numeric year, month (1-12), and day
 * without timezone shift side-effects.
 */
export function parseISODate(dateStr?: string | null): ISODateParts | null {
    if (!dateStr) return null;
    const clean = String(dateStr).trim();
    const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    if (month < 1 || month > 12 || day < 1 || day > 31) return null;

    return { year, month, day };
}

/**
 * Formats a date string (YYYY-MM-DD or ISO timestamp) to display format: "DD MMM YYYY" (e.g. "30 Oct 2026").
 */
export function formatDate(dateStr?: string | null, fallback = "-"): string {
    if (!dateStr) return fallback;

    const parts = parseISODate(dateStr);
    if (parts) {
        return `${parts.day} ${SHORT_MONTHS[parts.month - 1]} ${parts.year}`;
    }

    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
        return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }

    return fallback;
}
