export function parseLocaleFloat(value: string | number | undefined | null): number {
  if (value === undefined || value === null || value === '') return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const parsed = parseFloat(value.toString().replace(',', '.'));
  return isNaN(parsed) ? 0 : parsed;
}
