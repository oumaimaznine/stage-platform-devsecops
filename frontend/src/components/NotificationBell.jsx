import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();

  const loadCount = () => {
    api.get("/notifications/unread-count").then((res) => setUnreadCount(res.data.count));
  };

  const loadList = () => {
    api.get("/notifications").then((res) => setNotifications(res.data));
  };

  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, 20000); // rafraîchit toutes les 20s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const toggleOpen = () => {
    if (!open) loadList();
    setOpen((v) => !v);
  };

  const handleClick = async (notif) => {
    if (!notif.read_at) {
      await api.patch(`/notifications/${notif.id}/read`);
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n)));
    }
    setOpen(false);
    if (notif.link) navigate(notif.link);
  };

  const markAllRead = async () => {
    await api.patch("/notifications/mark-all-read");
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-label="Notifications"
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-ink-800 text-ink-500 hover:text-ink-100 hover:border-ink-500 transition-colors shadow-card"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-ink-800 rounded-xl shadow-2xl z-50 max-h-96 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-ink-800">
            <span className="font-semibold text-sm text-ink-100">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary-600 hover:text-primary-700 cursor-pointer">
                Tout marquer comme lu
              </button>
            )}
          </div>
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <p className="text-sm text-ink-500 p-4 text-center">Aucune notification pour le moment.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left p-3 border-b border-ink-800 hover:bg-ink-800 transition-colors ${
                    !n.read_at ? "bg-primary-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read_at && <span className="w-2 h-2 rounded-full bg-primary-600 mt-1.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-100 truncate">{n.title}</p>
                      <p className="text-xs text-ink-300 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-ink-500 mt-1">{timeAgo(n.created_at)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}