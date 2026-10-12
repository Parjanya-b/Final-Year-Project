import { Transaction } from './types';
import { toDateInputValue, fromDateInput } from './format';

// ── Constants ─────────────────────────────────────────────────────────────────
export const MIN_DAYS = 90;

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DayPoint {
  ds: string; // "YYYY-MM-DD"
  y: number;
}

export interface ForecastPoint {
  ds: string; // "YYYY-MM-DD"
  yhat: number;
  yhat_lower: number;
  yhat_upper: number;
}

// ── Error class ───────────────────────────────────────────────────────────────
export class ForecastError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'ForecastError';
  }
}

// ── buildDailySeries ──────────────────────────────────────────────────────────
/**
 * Convert expense transactions to a continuous daily series.
 *
 * - Filters to expenses only.
 * - Sums amounts per local calendar day (using toDateInputValue).
 * - Fills every day between the first and last observed day with 0.
 * - Uses Array.from(map.keys()) — NOT spread — for Map iteration.
 */
export function buildDailySeries(transactions: Transaction[]): DayPoint[] {
  // Keep only expenses
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return [];

  // Aggregate per local day string
  const map = new Map<string, number>();
  for (const t of expenses) {
    const key = toDateInputValue(t.date);
    map.set(key, (map.get(key) ?? 0) + t.amount);
  }

  // Find min/max dates
  const keys = Array.from(map.keys()).sort();
  if (keys.length === 0) return [];

  const start = fromDateInput(keys[0]);
  const end = fromDateInput(keys[keys.length - 1]);

  // Build continuous range
  const series: DayPoint[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const ds = toDateInputValue(cursor);
    series.push({ ds, y: map.get(ds) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return series;
}

// ── fetchForecast ─────────────────────────────────────────────────────────────
/**
 * POST the daily series to the Next.js proxy route.
 * Throws ForecastError on non-2xx responses.
 */
export async function fetchForecast(
  series: DayPoint[],
  periods = 90
): Promise<ForecastPoint[]> {
  const res = await fetch('/api/forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: series, periods }),
  });

  const body = await res.json();

  if (!res.ok) {
    const detail = body?.detail ?? {};
    throw new ForecastError(
      detail.code ?? 'FORECAST_FAILED',
      detail.message ?? 'An unknown error occurred.'
    );
  }

  return body.forecast as ForecastPoint[];
}

// ── shortDate ─────────────────────────────────────────────────────────────────
/**
 * Format a "YYYY-MM-DD" string as "11 Oct" style using en-IN locale.
 */
export function shortDate(ds: string): string {
  const d = fromDateInput(ds);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
