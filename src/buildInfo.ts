export function formatBuildTimestamp(builtAt: string, timeZone: string, locale: string, unavailableLabel: string): string {
  const date = new Date(builtAt);
  if (!Number.isFinite(date.getTime()) || !timeZone) return unavailableLabel;

  try {
    const formatted = new Intl.DateTimeFormat(locale, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: 'numeric', minute: '2-digit', second: '2-digit', timeZoneName: 'short',
      timeZone
    }).format(date);
    return `${formatted} (${timeZone})`;
  } catch {
    return unavailableLabel;
  }
}
