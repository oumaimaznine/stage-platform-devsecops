import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "./ui/Avatar";

function formatDay(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return "Aujourd'hui";
  return date.toLocaleDateString([], { day: "2-digit", month: "long" });
}

export default function ChatWindow({ conversationId }) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadMessages = async () => {
    const res = await api.get(`/conversations/${conversationId}/messages`);
    setMessages(res.data);
  };

  useEffect(() => {
    api.get(`/conversations/${conversationId}`).then((res) => setConversation(res.data));
    loadMessages();

    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await api.post(`/conversations/${conversationId}/messages`, { contenu: text });
      setMessages((prev) => [...prev, res.data]);
      setText("");
    } finally {
      setSending(false);
    }
  };

  if (!conversation)
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-ink-500 text-sm">Chargement...</p>
      </div>
    );

  const title = user.role === "etudiant" ? conversation.company?.nom : conversation.student?.user?.name;

  let lastDay = null;

  return (
    <div className="flex flex-col h-full">
      {/* En-tête */}
      <div className="px-6 h-[72px] border-b border-ink-800 flex items-center gap-3 shrink-0 bg-white">
        <Avatar name={title} size="md" />
        <div className="min-w-0">
          <p className="font-semibold text-ink-100 truncate">{title}</p>
          {conversation.offer && (
            <p className="text-xs text-primary-700 truncate">{conversation.offer.titre}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1 bg-ink-50">
        {messages.map((msg, i) => {
          const isMine = msg.sender_id === user.id;
          const day = formatDay(msg.created_at);
          const showDaySeparator = day !== lastDay;
          lastDay = day;
          const prevSameSender = i > 0 && messages[i - 1].sender_id === msg.sender_id && !showDaySeparator;

          return (
            <div key={msg.id}>
              {showDaySeparator && (
                <div className="flex items-center justify-center my-4">
                  <span className="text-[11px] text-ink-500 bg-white border border-ink-800 px-3 py-1 rounded-full shadow-card">
                    {day}
                  </span>
                </div>
              )}
              <div className={`flex ${isMine ? "justify-end" : "justify-start"} ${prevSameSender ? "mt-0.5" : "mt-3"}`}>
                <div
                  className={`max-w-md px-4 py-2.5 text-sm shadow-card ${
                    isMine
                      ? "bg-primary-600 text-white rounded-2xl rounded-br-md"
                      : "bg-white border border-ink-800 text-ink-100 rounded-2xl rounded-bl-md"
                  }`}
                >
                  <p className="leading-relaxed">{msg.contenu}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMine ? "text-white/70" : "text-ink-500"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Saisie */}
      <form onSubmit={handleSend} className="px-4 py-3 border-t border-ink-800 flex gap-2 shrink-0 bg-white">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-1 bg-white border border-ink-700 focus:border-primary-500 outline-none rounded-full px-4 py-2.5 text-sm text-ink-100 placeholder-ink-500 transition"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="bg-primary-600 hover:bg-primary-700 text-white w-11 h-11 rounded-full flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
