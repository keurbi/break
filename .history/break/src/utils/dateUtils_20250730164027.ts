export function getMinutes(start: string, end?: string): number {
  if (!end) return 0;
  const [h1, m1, s1] = start.split(":").map(Number);
  const [h2, m2, s2] = end.split(":").map(Number);
  const date1 = new Date();
  date1.setHours(h1, m1, s1 || 0, 0);
  const date2 = new Date();
  date2.setHours(h2, m2, s2 || 0, 0);
  return Math.round((date2.getTime() - date1.getTime()) / 60000);
}

export function isToday(dateString: string): boolean {
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function isThisWeek(dateString: string): boolean {
  const d = new Date(dateString);
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}
