/** Returns e.g. "Week of Jun 9" for the Monday of the current week. */
export function currentWeekLabel(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  const month = d.toLocaleString("en-US", { month: "short" });
  return `Week of ${month} ${d.getDate()}`;
}

export const CATEGORY_ORDER = ["Produce", "Protein", "Grains", "Dairy", "Pantry"];

export function sortByCategory<T extends { category: string | null }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.category ?? "");
    const bi = CATEGORY_ORDER.indexOf(b.category ?? "");
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}
