import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";
import EmptyState from "../components/ui/EmptyState";
import Avatar from "../components/ui/Avatar";
import { IconSearch, IconMessageCircle } from "../components/ui/Icons";

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searchParams] = useSearchParams();

  const loadConversations = () => {
    api.get("/conversations").then((res) => {
      setConversations(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const id = searchParams.get("conversation");
    if (id) setSelectedId(Number(id));
  }, [searchParams]);

  if (loading)
    return (
      <div className="flex h-[calc(100vh-64px)] md:h-screen items-center justify-center bg-ink-50">
        <p className="text-ink-500 text-sm">Chargement des conversations...</p>
      </div>
    );

  const filtered = conversations.filter((conv) => {
    const label = user.role === "etudiant" ? conv.company?.nom : conv.student?.user?.name;
    return label?.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen bg-ink-50">
      {/* Liste des conversations */}
      <div className="w-96 border-r border-ink-800 flex flex-col shrink-0 bg-white">
        <div className="p-5 border-b border-ink-800 shrink-0">
          <h1 className="text-lg font-bold text-ink-100 mb-1">Messages</h1>
          <p className="text-xs text-ink-500 mb-3">
            {conversations.length} conversation{conversations.length > 1 ? "s" : ""}
          </p>
          <div className="relative">
            <IconSearch className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              aria-label="Rechercher une conversation"
              className="w-full bg-white border border-ink-800 focus:border-primary-500 outline-none rounded-lg pl-9 pr-3 py-2.5 text-sm text-ink-100 placeholder-ink-500 shadow-card transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filtered.length === 0 && (
            <EmptyState
              icon={<IconMessageCircle className="w-9 h-9" />}
              title="Aucune conversation"
              description={
                conversations.length === 0
                  ? "Contacte une entreprise depuis une offre pour démarrer une discussion."
                  : "Aucune conversation ne correspond à ta recherche."
              }
            />
          )}

          {filtered.map((conv) => {
            const label = user.role === "etudiant" ? conv.company?.nom : conv.student?.user?.name;
            const isActive = selectedId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left p-3.5 rounded-xl flex items-start gap-3 transition-colors border cursor-pointer ${
                  isActive
                    ? "bg-primary-500/10 border-primary-500/40 shadow-card"
                    : "bg-white border-ink-800 hover:border-ink-700 hover:bg-ink-800/5 shadow-card"
                }`}
              >
                <Avatar name={label} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-ink-100 truncate">{label}</p>
                    {conv.last_message?.created_at && (
                      <span className="text-[11px] text-ink-500 shrink-0">
                        {new Date(conv.last_message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                  {conv.offer && (
                    <p className="text-xs truncate text-primary-700">{conv.offer.titre}</p>
                  )}
                  {conv.last_message && (
                    <p className="text-sm truncate mt-0.5 text-ink-500">{conv.last_message.contenu}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fenêtre de chat */}
      <div className="flex-1 min-w-0 bg-ink-50">
        {selectedId ? (
          <ChatWindow conversationId={selectedId} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 rounded-full bg-white border border-ink-800 flex items-center justify-center mb-4 shadow-card">
              <IconMessageCircle className="w-7 h-7 text-ink-500" />
            </div>
            <p className="text-ink-100 font-medium">Sélectionne une conversation</p>
            <p className="text-ink-500 text-sm mt-1">Choisis une discussion à gauche pour l'afficher ici.</p>
          </div>
        )}
      </div>
    </div>
  );
}
