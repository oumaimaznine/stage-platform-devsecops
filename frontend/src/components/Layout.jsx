import Sidebar from "./Sidebar";
import FloatingChatButton from "./FloatingChatButton";
import NotificationBell from "./NotificationBell";
import Avatar from "./ui/Avatar";
import { useAuth } from "../context/AuthContext";

export default function Layout({ title, children }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-ink-950 flex">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col pt-14 md:pt-0">
        {title ? (
          <header className="sticky top-0 z-30 bg-gradient-to-r from-primary-700 to-primary-900 border-b border-primary-900 px-6 py-4 shadow-sm flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Avatar name={user?.name} size="md" />
            </div>
          </header>
        ) : null}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <FloatingChatButton />
    </div>
  );
}