const STORAGE_KEY = "missionmap_my_event_slugs";

export function getMyEventSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addMyEventSlug(slug: string): void {
  const slugs = getMyEventSlugs();
  if (slugs.includes(slug)) return;
  slugs.unshift(slug);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}
