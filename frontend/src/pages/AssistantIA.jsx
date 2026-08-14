import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   ICONS
========================================================= */

const Icon = {
  Sparkles: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M12 3.5 13.35 8.65 18.5 10 13.35 11.35 12 16.5 10.65 11.35 5.5 10l5.15-1.35L12 3.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m19 15 .65 2.35L22 18l-2.35.65L19 21l-.65-2.35L16 18l2.35-.65L19 15Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Send: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m21.5 3-7.1 18-3.2-7.7L3.5 10.1 21.5 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m21.5 3-10.3 10.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Plus: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M12 5v14M5 12h14"
        strokeLinecap="round"
      />
    </svg>
  ),

  Briefcase: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2.5"
      />
      <path
        d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7M3 12h18"
        strokeLinecap="round"
      />
    </svg>
  ),

  File: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M14 2.5H6.5A2.5 2.5 0 0 0 4 5v14a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 20 19V8.5L14 2.5Z"
        strokeLinejoin="round"
      />
      <path
        d="M14 2.5V8.5h6M8 13h8M8 17h5"
        strokeLinecap="round"
      />
    </svg>
  ),

  Calendar: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="16"
        rx="2.5"
      />
      <path
        d="M8 2.5v4M16 2.5v4M3.5 10h17"
        strokeLinecap="round"
      />
    </svg>
  ),

  Message: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M19.5 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-4.7a7.5 7.5 0 1 1 15.5-4.8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  ArrowRight: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  User: ({ className = "" }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path
        d="M5 20a7 7 0 0 1 14 0"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* =========================================================
   SUGGESTIONS
========================================================= */

const suggestions = [
  {
    icon: Icon.Briefcase,
    title: "Offres de stage",
    text: "Comment trouver une offre adaptée à mon profil ?",
  },
  {
    icon: Icon.Message,
    title: "Candidatures",
    text: "Comment suivre et gérer mes candidatures ?",
  },
  {
    icon: Icon.Calendar,
    title: "Entretiens",
    text: "Comment fonctionne la gestion des entretiens ?",
  },
  {
    icon: Icon.File,
    title: "Conventions",
    text: "Comment fonctionne une convention de stage ?",
  },
];

/* =========================================================
   ASSISTANT IA
========================================================= */

export default function AssistantIA() {
  const { user } = useAuth();

  const firstName =
    user?.name?.split(" ")[0] || "Utilisateur";

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Bonjour ${firstName} 👋

Je suis votre assistant IA.

Je peux vous accompagner dans l'utilisation de la plateforme et répondre à vos questions sur les offres, les candidatures, les entretiens, les conventions, les rapports et bien plus encore.

Que souhaitez-vous savoir ?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  const isInitial = messages.length === 1;

  /* =======================================================
     SCROLL
  ======================================================= */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  /* =======================================================
     TEXTAREA
  ======================================================= */

  const resizeTextarea = () => {
    const element = textareaRef.current;

    if (!element) return;

    element.style.height = "auto";

    element.style.height = `${Math.min(
      element.scrollHeight,
      140
    )}px`;
  };

  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const sendMessage = async (customText = null) => {
    const text = (
      customText !== null ? customText : input
    ).trim();

    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);
    setInput("");
    resetTextarea();
    setLoading(true);

    try {
      const response = await api.post(
        "/assistant/chat",
        {
          message: text,
          history: updatedMessages.slice(-10),
        }
      );

      const answer =
        response.data?.message ||
        "Je n'ai pas pu générer une réponse.";

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (error) {
      console.error(
        "Erreur Assistant IA :",
        error
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  };

  /* =======================================================
     SUGGESTION
  ======================================================= */

  const handleSuggestion = (text) => {
    if (loading) return;

    setInput(text);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      resizeTextarea();
    });
  };

  /* =======================================================
     NEW CONVERSATION
  ======================================================= */

  const startNewConversation = () => {
    setMessages([
      {
        role: "assistant",
        content: `Bonjour ${firstName} 👋

Je suis votre assistant IA.

Posez-moi votre question et je ferai de mon mieux pour vous aider.`,
      },
    ]);

    setInput("");
    resetTextarea();
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] px-4 py-5 md:px-7 md:py-6">

      {/* =====================================================
          UN SEUL GRAND RECTANGLE
      ===================================================== */}

      <div
        className="
          mx-auto
          flex
          h-[calc(100vh-104px)]
          max-w-[1150px]
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-[#e4edef]
          bg-white
          shadow-[0_3px_15px_rgba(18,63,75,0.045)]
        "
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="
            flex
            h-[72px]
            shrink-0
            items-center
            justify-between
            border-b
            border-[#e4edef]
            bg-white
            px-5
            md:px-7
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-[#EAFBFC]
                text-[#08B7C9]
              "
            >
              <Icon.Sparkles className="h-5 w-5" />
            </div>

            <div>
              <h1
                className="
                  text-[17px]
                  font-bold
                  text-[#123F4B]
                "
              >
                Assistant IA
              </h1>

              <p
                className="
                  text-[11px]
                  text-[#819399]
                "
              >
                Intelligent · Rapide · Disponible
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={startNewConversation}
            disabled={loading}
            className="
              group
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#e4edef]
              bg-white
              px-3.5
              py-2.5
              text-xs
              font-semibold
              text-[#526970]
              transition-all
              duration-200
              hover:border-[#c9e9ec]
              hover:bg-[#EAFBFC]
              hover:text-[#08B7C9]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Icon.Plus
              className="
                h-4
                w-4
                transition-transform
                duration-200
                group-hover:rotate-90
              "
            />

            <span className="hidden sm:block">
              Nouvelle conversation
            </span>

            <span className="sm:hidden">
              Nouveau
            </span>
          </button>

        </div>

        {/* ===================================================
            CHAT AREA
        =================================================== */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            bg-[#f5f7f8]
            px-4
            py-6
            sm:px-7
            md:px-10
          "
        >

          {/* =================================================
              INITIAL HERO
          ================================================= */}

          {isInitial && (
            <section
              className="
                mx-auto
                mb-6
                max-w-2xl
                text-center
              "
            >

              <div
                className="
                  mx-auto
                  mb-3
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                "
              >
                <Icon.Sparkles className="h-6 w-6" />
              </div>

              <h2
                className="
                  text-xl
                  font-bold
                  tracking-tight
                  text-[#123F4B]
                  sm:text-2xl
                "
              >
                Que puis-je faire pour vous ?
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-lg
                  text-xs
                  leading-5
                  text-[#819399]
                "
              >
                Posez une question sur votre plateforme
                de stages et obtenez rapidement une
                réponse.
              </p>

            </section>
          )}

          {/* =================================================
              SUGGESTIONS
          ================================================= */}

          {isInitial && !loading && (
            <section
              className="
                mx-auto
                mb-6
                grid
                max-w-3xl
                gap-3
                sm:grid-cols-2
              "
            >

              {suggestions.map(
                (suggestion) => {
                  const SuggestionIcon =
                    suggestion.icon;

                  return (
                    <button
                      key={suggestion.title}
                      type="button"
                      onClick={() =>
                        handleSuggestion(
                          suggestion.text
                        )
                      }
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#e4edef]
                        bg-white
                        p-3.5
                        text-left
                        shadow-[0_3px_12px_rgba(18,63,75,0.035)]
                        transition-all
                        duration-300
                        hover:-translate-y-[2px]
                        hover:border-[#c9e9ec]
                        hover:shadow-[0_8px_22px_rgba(18,63,75,0.07)]
                      "
                    >

                      <div className="flex items-start gap-3">

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#EAFBFC]
                            text-[#08B7C9]
                            transition-colors
                            duration-300
                            group-hover:bg-[#08B7C9]
                            group-hover:text-white
                          "
                        >
                          <SuggestionIcon className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                            "
                          >

                            <p
                              className="
                                text-xs
                                font-bold
                                text-[#123F4B]
                              "
                            >
                              {suggestion.title}
                            </p>

                            <Icon.ArrowRight
                              className="
                                h-3.5
                                w-3.5
                                text-[#94A4A9]
                                transition-all
                                duration-300
                                group-hover:translate-x-1
                                group-hover:text-[#08B7C9]
                              "
                            />

                          </div>

                          <p
                            className="
                              mt-1
                              text-[11px]
                              leading-5
                              text-[#819399]
                            "
                          >
                            {suggestion.text}
                          </p>

                        </div>

                      </div>

                    </button>
                  );
                }
              )}

            </section>
          )}

          {/* =================================================
              MESSAGES
          ================================================= */}

          <div
            className="
              mx-auto
              max-w-3xl
              space-y-5
            "
          >

            {messages.map(
              (message, index) => {
                const isUser =
                  message.role === "user";

                return (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex gap-3 ${
                      isUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    {/* AI ICON */}

                    {!isUser && (
                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#EAFBFC]
                          text-[#08B7C9]
                        "
                      >
                        <Icon.Sparkles className="h-3.5 w-3.5" />
                      </div>
                    )}

                    {/* USER ICON */}

                    {isUser && (
                      <div
                        className="
                          order-2
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-white
                          border
                          border-[#e4edef]
                          text-[#819399]
                        "
                      >
                        <Icon.User className="h-3.5 w-3.5" />
                      </div>
                    )}

                    {/* MESSAGE */}

                    <div
                      className={`
                        max-w-[84%]
                        sm:max-w-[72%]
                        ${isUser ? "order-1" : ""}
                      `}
                    >

                      <div
                        className={`
                          px-4
                          py-3
                          text-sm
                          leading-6
                          shadow-[0_3px_12px_rgba(18,63,75,0.035)]
                          ${
                            isUser
                              ? `
                                rounded-2xl
                                rounded-br-md
                                bg-[#08B7C9]
                                text-white
                              `
                              : `
                                rounded-2xl
                                rounded-bl-md
                                border
                                border-[#e4edef]
                                bg-white
                                text-[#526970]
                              `
                          }
                        `}
                      >
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>

                      <div
                        className={`
                          mt-1
                          px-1
                          text-[9px]
                          font-medium
                          text-[#94A4A9]
                          ${
                            isUser
                              ? "text-right"
                              : ""
                          }
                        `}
                      >
                        {isUser
                          ? "Vous"
                          : "Assistant IA"}
                      </div>

                    </div>

                  </div>
                );
              }
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="flex gap-3">

                <div
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#EAFBFC]
                    text-[#08B7C9]
                  "
                >
                  <Icon.Sparkles className="h-3.5 w-3.5" />
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    rounded-bl-md
                    border
                    border-[#e4edef]
                    bg-white
                    px-4
                    py-3
                  "
                >

                  <div className="flex items-center gap-1">

                    <span
                      className="
                        h-1.5
                        w-1.5
                        animate-bounce
                        rounded-full
                        bg-[#08B7C9]
                      "
                    />

                    <span
                      className="
                        h-1.5
                        w-1.5
                        animate-bounce
                        rounded-full
                        bg-[#08B7C9]
                      "
                      style={{
                        animationDelay: "120ms",
                      }}
                    />

                    <span
                      className="
                        h-1.5
                        w-1.5
                        animate-bounce
                        rounded-full
                        bg-[#08B7C9]
                      "
                      style={{
                        animationDelay: "240ms",
                      }}
                    />

                  </div>

                  <span
                    className="
                      text-xs
                      font-medium
                      text-[#819399]
                    "
                  >
                    Réflexion en cours...
                  </span>

                </div>

              </div>
            )}

            <div ref={bottomRef} />

          </div>

        </div>

        {/* ===================================================
            COMPOSER
        =================================================== */}

        <div
          className="
            shrink-0
            border-t
            border-[#e4edef]
            bg-white
            px-4
            py-3
            sm:px-7
          "
        >

          <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-3xl"
          >

            <div
              className="
                flex
                items-end
                rounded-2xl
                border
                border-[#dce7e9]
                bg-white
                p-1.5
                shadow-[0_3px_12px_rgba(18,63,75,0.04)]
                transition-all
                duration-200
                focus-within:border-[#08B7C9]
                focus-within:shadow-[0_5px_18px_rgba(8,183,201,0.10)]
              "
            >

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  resizeTextarea();
                }}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                placeholder="Écrivez votre question..."
                className="
                  max-h-[140px]
                  min-h-[42px]
                  flex-1
                  resize-none
                  bg-transparent
                  px-3
                  py-2.5
                  text-sm
                  text-[#123F4B]
                  outline-none
                  placeholder:text-[#94A4A9]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  !input.trim()
                }
                className="
                  mb-0.5
                  mr-0.5
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#08B7C9]
                  text-white
                  transition-all
                  duration-200
                  hover:bg-[#079FAF]
                  disabled:cursor-not-allowed
                  disabled:bg-[#dcecef]
                  disabled:text-[#94A4A9]
                "
              >
                <Icon.Send className="h-4 w-4" />
              </button>

            </div>

            <div
              className="
                mt-1.5
                flex
                items-center
                justify-between
                px-2
              "
            >

              <p
                className="
                  text-[9px]
                  text-[#94A4A9]
                "
              >
                Entrée pour envoyer · Shift + Entrée
                pour une nouvelle ligne
              </p>

              <p
                className="
                  hidden
                  text-[9px]
                  text-[#94A4A9]
                  sm:block
                "
              >
                Assistant IA
              </p>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
}