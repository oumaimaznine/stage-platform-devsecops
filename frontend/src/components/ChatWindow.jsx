import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "./ui/Avatar";

function formatDay(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();

  const isToday =
    date.toDateString() === today.toDateString();

  if (isToday) return "Aujourd'hui";

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "long",
  });
}

export default function ChatWindow({ conversationId }) {
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);

  /* =========================================================
     LOAD MESSAGES
  ========================================================= */

  const loadMessages = async () => {
    const res = await api.get(
      `/conversations/${conversationId}/messages`
    );

    setMessages(res.data);
  };

  /* =========================================================
     LOAD CONVERSATION
  ========================================================= */

  useEffect(() => {
    api
      .get(`/conversations/${conversationId}`)
      .then((res) => {
        setConversation(res.data);
      });

    loadMessages();

    const interval = setInterval(loadMessages, 3000);

    return () => clearInterval(interval);
  }, [conversationId]);

  /* =========================================================
     AUTO SCROLL
  ========================================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    setSending(true);

    try {
      const res = await api.post(
        `/conversations/${conversationId}/messages`,
        {
          contenu: text,
        }
      );

      setMessages((prev) => [
        ...prev,
        res.data,
      ]);

      setText("");
    } finally {
      setSending(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (!conversation) {
    return (
      <div className="h-full bg-[#f5f7f8] flex items-center justify-center">
        <div className="text-center">

          <div
            className="
              w-8
              h-8
              mx-auto
              border-[3px]
              border-[#dcecef]
              border-t-[#08B7C9]
              rounded-full
              animate-spin
            "
          />

          <p className="mt-3 text-sm text-[#819399]">
            Chargement...
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     TITLE
  ========================================================= */

  const title =
    user.role === "etudiant"
      ? conversation.company?.nom
      : conversation.student?.user?.name;

  let lastDay = null;

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="flex flex-col h-full bg-[#f5f7f8]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          px-5
          lg:px-6
          h-[72px]
          border-b
          border-[#e4edef]
          flex
          items-center
          gap-3
          shrink-0
          bg-white
          shadow-[0_2px_8px_rgba(18,63,75,0.03)]
        "
      >

        {/* Avatar */}

        <div className="relative shrink-0">

          <Avatar
            name={title}
            size="md"
          />

          <span
            className="
              absolute
              -bottom-0.5
              -right-0.5
              w-3
              h-3
              rounded-full
              bg-[#22C55E]
              border-2
              border-white
            "
          />

        </div>

        {/* User information */}

        <div className="min-w-0">

          <p
            className="
              font-semibold
              text-[#123F4B]
              truncate
              text-sm
            "
          >
            {title || "Utilisateur"}
          </p>

          {conversation.offer && (
            <p
              className="
                text-[11px]
                font-medium
                text-[#08B7C9]
                truncate
                mt-0.5
              "
            >
              {conversation.offer.titre}
            </p>
          )}

        </div>

      </div>

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-4
          sm:px-6
          py-5
          space-y-1
          bg-[#f5f7f8]
        "
      >

        {messages.length === 0 && (
          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-5
            "
          >

            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-white
                border
                border-[#e4edef]
                flex
                items-center
                justify-center
                mb-4
                shadow-[0_4px_15px_rgba(18,63,75,0.05)]
              "
            >

              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                  flex
                  items-center
                  justify-center
                "
              >

                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 014 11.5 8.5 8.5 0 0112.5 3a8.5 8.5 0 018.5 8.5Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

              </div>

            </div>

            <p className="text-sm font-semibold text-[#123F4B]">
              Aucun message
            </p>

            <p className="text-xs text-[#819399] mt-1">
              Commencez la conversation.
            </p>

          </div>
        )}

        {messages.map((msg, i) => {

          const isMine =
            msg.sender_id === user.id;

          const day = formatDay(
            msg.created_at
          );

          const showDaySeparator =
            day !== lastDay;

          lastDay = day;

          const prevSameSender =
            i > 0 &&
            messages[i - 1].sender_id ===
              msg.sender_id &&
            !showDaySeparator;

          return (
            <div key={msg.id}>

              {/* =================================================
                  DAY SEPARATOR
              ================================================= */}

              {showDaySeparator && (
                <div className="flex items-center justify-center my-5">

                  <div className="flex items-center gap-3 w-full max-w-md">

                    <div className="flex-1 h-px bg-[#e4edef]" />

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#819399]
                        bg-white
                        border
                        border-[#e4edef]
                        px-3
                        py-1
                        rounded-full
                        shadow-[0_2px_6px_rgba(18,63,75,0.04)]
                      "
                    >
                      {day}
                    </span>

                    <div className="flex-1 h-px bg-[#e4edef]" />

                  </div>

                </div>
              )}

              {/* =================================================
                  MESSAGE
              ================================================= */}

              <div
                className={`
                  flex
                  ${
                    isMine
                      ? "justify-end"
                      : "justify-start"
                  }
                  ${
                    prevSameSender
                      ? "mt-1"
                      : "mt-3"
                  }
                `}
              >

                <div
                  className={`
                    max-w-[75%]
                    sm:max-w-md
                    px-4
                    py-2.5
                    text-sm
                    shadow-[0_3px_12px_rgba(18,63,75,0.05)]

                    ${
                      isMine
                        ? `
                          bg-[#08B7C9]
                          text-white
                          rounded-2xl
                          rounded-br-md
                        `
                        : `
                          bg-white
                          border
                          border-[#e4edef]
                          text-[#123F4B]
                          rounded-2xl
                          rounded-bl-md
                        `
                    }
                  `}
                >

                  <p className="leading-relaxed break-words">
                    {msg.contenu}
                  </p>

                  <p
                    className={`
                      text-[10px]
                      mt-1
                      text-right

                      ${
                        isMine
                          ? "text-white/70"
                          : "text-[#94A4A9]"
                      }
                    `}
                  >
                    {new Date(
                      msg.created_at
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                </div>

              </div>

            </div>
          );
        })}

        <div ref={bottomRef} />

      </div>

      {/* =====================================================
          MESSAGE INPUT
      ===================================================== */}

      <form
        onSubmit={handleSend}
        className="
          px-4
          sm:px-5
          py-3
          border-t
          border-[#e4edef]
          flex
          gap-2
          shrink-0
          bg-white
        "
      >

        <input
          type="text"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Écrire un message..."
          className="
            flex-1
            h-11
            bg-[#f8fafb]
            border
            border-[#e4edef]
            focus:border-[#08B7C9]
            focus:bg-white
            focus:ring-2
            focus:ring-[#08B7C9]/10
            outline-none
            rounded-full
            px-4
            text-sm
            text-[#123F4B]
            placeholder:text-[#a3b0b4]
            transition-all
          "
        />

        {/* ===================================================
            SEND BUTTON
        =================================================== */}

        <button
          type="submit"
          disabled={
            sending || !text.trim()
          }
          className="
            bg-[#08B7C9]
            hover:bg-[#079faf]
            text-white
            w-11
            h-11
            rounded-full
            flex
            items-center
            justify-center
            disabled:opacity-40
            disabled:cursor-not-allowed
            transition-all
            duration-200
            shrink-0
            shadow-[0_4px_12px_rgba(8,183,201,0.20)]
            hover:shadow-[0_6px_16px_rgba(8,183,201,0.25)]
          "
        >

          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
            />
          </svg>

        </button>

      </form>

    </div>
  );
}