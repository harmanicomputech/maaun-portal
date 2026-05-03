import {
  createContext, useContext, useEffect, useRef,
  useState, useCallback, ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export type AppNotification = {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "payment" | "result" | "enrollment";
  isRead: boolean;
  createdAt: string;
};

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  hasNew: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const POLL_MS = 12_000;
const BASE = (import.meta.env.BASE_URL ?? "").replace(/\/$/, "");
const authHdr = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [isLoading, setIsLoading]         = useState(false);
  const [hasNew, setHasNew]               = useState(false);

  const lastAt   = useRef<string | null>(null);
  const fetching = useRef(false);
  const timer    = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };

  // Fetch and merge, optionally delta-only
  const doFetch = useCallback(async (delta: boolean) => {
    if (!token || !user || fetching.current) return;
    if (delta && document.visibilityState === "hidden") return;
    fetching.current = true;
    try {
      const since = delta && lastAt.current
        ? `&since=${encodeURIComponent(lastAt.current)}`
        : "";
      const res = await fetch(`${BASE}/api/notifications/my?limit=20${since}`, {
        headers: authHdr(token),
      });
      if (!res.ok) return;
      const data: { notifications: AppNotification[]; unreadCount: number } = await res.json();

      setUnreadCount(data.unreadCount);

      if (data.notifications.length === 0) return;

      if (delta) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const fresh = data.notifications.filter(n => !existingIds.has(n.id));
          if (fresh.length === 0) return prev;
          // Flash "hasNew" for 3 seconds
          setHasNew(true);
          setTimeout(() => setHasNew(false), 3_000);
          if (fresh[0]) lastAt.current = fresh[0].createdAt;
          return [...fresh, ...prev].slice(0, 50);
        });
      } else {
        setNotifications(data.notifications);
        if (data.notifications[0]) lastAt.current = data.notifications[0].createdAt;
      }
    } catch { /* silent */ } finally {
      fetching.current = false;
    }
  }, [token, user]);

  const startTimer = useCallback(() => {
    stopTimer();
    timer.current = setInterval(() => doFetch(true), POLL_MS);
  }, [doFetch]);

  // Boot: full fetch + start polling
  useEffect(() => {
    if (!token || !user) {
      setNotifications([]);
      setUnreadCount(0);
      stopTimer();
      return;
    }
    setIsLoading(true);
    doFetch(false).finally(() => setIsLoading(false));
    startTimer();

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        doFetch(true);   // immediate delta on tab focus
        startTimer();
      } else {
        stopTimer();     // pause when hidden
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopTimer();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [token, user]);

  const markAsRead = useCallback(async (id: number) => {
    if (!token) return;
    await fetch(`${BASE}/api/notifications/${id}/read`, {
      method: "PATCH", headers: authHdr(token),
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [token]);

  const markAllAsRead = useCallback(async () => {
    if (!token) return;
    await fetch(`${BASE}/api/notifications/read-all`, {
      method: "PATCH", headers: authHdr(token),
    });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [token]);

  const refresh = useCallback(() => doFetch(true), [doFetch]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, isLoading, hasNew, markAsRead, markAllAsRead, refresh }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
}
