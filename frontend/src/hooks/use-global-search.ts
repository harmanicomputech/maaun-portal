import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export type SearchResultType =
  | "student"
  | "course"
  | "announcement"
  | "welfare"
  | "disciplinary"
  | "lecturer";

export interface SearchResult {
  type: SearchResultType;
  id: number;
  title: string;
  subtitle: string;
  route: string;
}

const BASE = (import.meta.env.BASE_URL ?? "").replace(/\/$/, "");

// Module-level LRU-ish cache shared across hook instances.
// Key: `${role}:${query_lowercase}` → limited to 60 entries.
const queryCache = new Map<string, SearchResult[]>();
const MAX_CACHE = 60;

function cacheSet(key: string, value: SearchResult[]) {
  if (queryCache.size >= MAX_CACHE) {
    const oldest = queryCache.keys().next().value;
    if (oldest) queryCache.delete(oldest);
  }
  queryCache.set(key, value);
}

export function useGlobalSearch() {
  const { user, token } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef    = useRef<AbortController | null>(null);

  const doFetch = useCallback(async (q: string) => {
    if (!token || !user) return;

    const trimmed = q.trim();
    const cacheKey = `${user.role}:${trimmed.toLowerCase()}`;

    const cached = queryCache.get(cacheKey);
    if (cached) {
      setResults(cached);
      setIsLoading(false);
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(
        `${BASE}/api/search?q=${encodeURIComponent(trimmed)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortRef.current.signal,
        },
      );
      if (!res.ok) { setIsLoading(false); return; }

      const data: { results: SearchResult[] } = await res.json();
      cacheSet(cacheKey, data.results);
      setResults(data.results);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      abortRef.current?.abort();
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => doFetch(trimmed), 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doFetch]);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setQuery("");
    setResults([]);
    setIsLoading(false);
  }, []);

  // Group results by type for display
  const grouped = results.reduce<Partial<Record<SearchResultType, SearchResult[]>>>(
    (acc, r) => {
      if (!acc[r.type]) acc[r.type] = [];
      acc[r.type]!.push(r);
      return acc;
    },
    {},
  );

  return { query, setQuery, results, grouped, isLoading, clear };
}
