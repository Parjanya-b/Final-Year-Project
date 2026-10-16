const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

// 148920 → ₹1,48,920
export const formatINR = (n) => inr.format(Math.round(n));

export const formatDate = (d) =>
  d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// Date → "2026-10-11" (for <input type="date">)
export function toDateInputValue(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// "2026-10-11" → Date at noon (avoids timezone day-shift bugs)
export const fromDateInput = (s) => new Date(`${s}T12:00:00`);
