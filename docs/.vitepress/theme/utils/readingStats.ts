export interface ReadingStats {
  today: number;
  total: number;
}

interface StoredReadingStats extends ReadingStats {
  date: string;
}

export const READING_STATS_EVENT = 'blog-reading-stats';
const STORAGE_KEY = 'blog-reading-stats';

function currentDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isStoredReadingStats(value: unknown): value is StoredReadingStats {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.date === 'string'
    && typeof candidate.today === 'number'
    && Number.isFinite(candidate.today)
    && typeof candidate.total === 'number'
    && Number.isFinite(candidate.total);
}

function loadStoredStats(): StoredReadingStats {
  const empty = { date: currentDateKey(), today: 0, total: 0 };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredReadingStats(parsed)) return empty;
    return parsed.date === empty.date ? parsed : { ...parsed, date: empty.date, today: 0 };
  } catch {
    return empty;
  }
}

export function readReadingStats(): ReadingStats {
  const stored = loadStoredStats();
  return { today: stored.today, total: stored.total };
}

export function recordPageView(): ReadingStats {
  const stored = loadStoredStats();
  const updated: StoredReadingStats = {
    date: stored.date,
    today: stored.today + 1,
    total: stored.total + 1
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    return { today: stored.today, total: stored.total };
  }

  const stats = { today: updated.today, total: updated.total };
  window.dispatchEvent(new CustomEvent<ReadingStats>(READING_STATS_EVENT, { detail: stats }));
  return stats;
}
