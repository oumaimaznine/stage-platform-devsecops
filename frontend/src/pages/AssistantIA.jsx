import { useState, useRef, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";

export default function AssistantIA() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { role: "assistant", content: `Bonjour ${user?.name?.split(" ")[0] || ""} ! Je suis ton assistant IA. Pose-moi une question sur les offres, candidatures, conventions ou rapports.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/assistant/chat", {
        message: text,
        history: newMessages.slice(-10),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Désolé, une erreur est survenue. Réessaie dans un instant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col h-[calc(100vh-3rem)]">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-ink-100">Assistant IA</h1>
        <p className="text-sm text-ink-500 mt-1">Pose tes questions sur la plateforme, en français.</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white border border-ink-800 rounded-xl shadow-card p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "assistant" ? (
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 text-sm font-semibold">
                AI
              </div>
            ) : (
              <Avatar name={user?.name} size="sm" />
            )}
            <div
              className={`max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary-600 text-white"
                  : "bg-ink-800 text-ink-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center shrink-0 text-sm font-semibold">
              AI
            </div>
            <div className="bg-ink-800 text-ink-500 rounded-xl px-3.5 py-2.5 text-sm">
              En train d'écrire...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex gap-2 mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ton message..."
          className="flex-1 bg-white border border-ink-800 focus:border-primary-500 outline-none rounded-lg px-3.5 py-2.5 text-sm text-ink-100 placeholder-ink-500 shadow-card"
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          Envoyer
        </Button>
      </form>
    </div>
  );
}