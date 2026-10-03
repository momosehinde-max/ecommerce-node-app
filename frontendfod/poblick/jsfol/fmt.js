


export function naira(value) {
  const n = Number(value);
  if (!isFinite(n) || (value === null || value === undefined || value === '')) return '—';
  return '₦' + n.toLocaleString('en-NG');
}

/* plain number, thousands separated, no currency sign */

export function count(value) {
  const n = Number(value);
  return isFinite(n) ? n.toLocaleString('en-NG') : '0';
}
