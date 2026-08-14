import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ChatWindow from "../components/ChatWindow";
import EmptyState from "../components/ui/EmptyState";
import Avatar from "../components/ui/Avatar";
import {
  IconSearch,
  IconMessageCircle,
} from "../components/ui/Icons";

export default function Messages() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [searchParams] = useSearchParams();

  /* =========================================================
     LOAD CONVERSATIONS
  ========================================================= */

  const loadConversations = () => {
    api
      .get("/conversations")
      .then((res) => {
        setConversations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement conversations :", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadConversations();

    const interval = setInterval(loadConversations, 10000);

    return () => clearInterval(interval);
  }, []);

  /* =========================================================
     SELECT CONVERSATION FROM URL
  ========================================================= */

  useEffect(() => {
    const id = searchParams.get("conversation");

    if (id) {
      setSelectedId(Number(id));
    }
  }, [searchParams]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] flex items-center justify-center">
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
            Chargement des conversations...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     FILTER
  ========================================================= */

  const filtered = conversations.filter((conv) => {
    const label =
      user.role === "etudiant"
        ? conv.company?.nom
        : conv.student?.user?.name;

    return label
      ?.toLowerCase()
      .includes(query.toLowerCase());
  });

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen bg-[#f5f7f8] flex overflow-hidden">

      {/* =====================================================
          LEFT - CONVERSATIONS
      ===================================================== */}

      <div
        className="
          w-full
          sm:w-[360px]
          lg:w-[390px]
          border-r
          border-[#e4edef]
          flex
          flex-col
          shrink-0
          bg-white
        "
      >

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="p-5 border-b border-[#e4edef] shrink-0">

          <div className="flex items-center justify-between gap-3">

            <div>
              <h1 className="text-xl font-bold text-[#123F4B]">
                Messages
              </h1>

              <p className="text-xs text-[#819399] mt-1">
                {conversations.length} conversation
                {conversations.length > 1 ? "s" : ""}
              </p>
            </div>

            {/* Message icon */}

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
              <IconMessageCircle className="w-5 h-5" />
            </div>

          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="relative mt-4">

            <IconSearch
              className="
                w-4
                h-4
                text-[#819399]
                absolute
                left-3
                top-1/2
                -translate-y-1/2
              "
            />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une conversation..."
              aria-label="Rechercher une conversation"
              className="
                w-full
                h-11
                bg-[#f8fafb]
                border
                border-[#e4edef]
                focus:border-[#08B7C9]
                focus:bg-white
                focus:ring-2
                focus:ring-[#08B7C9]/10
                outline-none
                rounded-xl
                pl-9
                pr-3
                text-sm
                text-[#123F4B]
                placeholder:text-[#a3b0b4]
                transition-all
              "
            />

          </div>

        </div>

        {/* ===================================================
            CONVERSATIONS LIST
        =================================================== */}

        <div className="flex-1 overflow-y-auto p-3">

          {filtered.length === 0 && (
            <div className="h-full flex items-center justify-center px-3">

              <EmptyState
                icon={
                  <IconMessageCircle className="w-9 h-9" />
                }
                title="Aucune conversation"
                description={
                  conversations.length === 0
                    ? "Contacte une entreprise depuis une offre pour démarrer une discussion."
                    : "Aucune conversation ne correspond à ta recherche."
                }
              />

            </div>
          )}

          <div className="space-y-2">

            {filtered.map((conv) => {

              const label =
                user.role === "etudiant"
                  ? conv.company?.nom
                  : conv.student?.user?.name;

              const isActive = selectedId === conv.id;

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`
                    w-full
                    text-left
                    p-3.5
                    rounded-xl
                    flex
                    items-start
                    gap-3
                    transition-all
                    duration-200
                    border

                    ${
                      isActive
                        ? `
                          bg-[#EAFBFC]
                          border-[#bcecef]
                          shadow-[0_4px_14px_rgba(8,183,201,0.08)]
                        `
                        : `
                          bg-white
                          border-[#e4edef]
                          hover:border-[#c9e9ec]
                          hover:bg-[#f9fcfc]
                          hover:shadow-[0_4px_14px_rgba(18,63,75,0.05)]
                        `
                    }
                  `}
                >

                  {/* =================================================
                      AVATAR
                  ================================================= */}

                  <div className="relative shrink-0">

                    <Avatar
                      name={label}
                      size="md"
                    />

                    {/* Online / active indicator */}

                    {isActive && (
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
                    )}

                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================= */}

                  <div className="flex-1 min-w-0">

                    <div
                      className="
                        flex
                        items-baseline
                        justify-between
                        gap-2
                      "
                    >

                      <p
                        className={`
                          font-semibold
                          truncate
                          text-sm

                          ${
                            isActive
                              ? "text-[#123F4B]"
                              : "text-[#123F4B]"
                          }
                        `}
                      >
                        {label || "Utilisateur"}
                      </p>

                      {conv.last_message?.created_at && (
                        <span
                          className="
                            text-[10px]
                            text-[#94A4A9]
                            shrink-0
                          "
                        >
                          {new Date(
                            conv.last_message.created_at
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}

                    </div>

                    {/* OFFER */}

                    {conv.offer && (
                      <p
                        className="
                          text-[11px]
                          font-semibold
                          text-[#08B7C9]
                          truncate
                          mt-1
                        "
                      >
                        {conv.offer.titre}
                      </p>
                    )}

                    {/* LAST MESSAGE */}

                    {conv.last_message && (
                      <p
                        className="
                          text-xs
                          truncate
                          mt-1
                          text-[#819399]
                        "
                      >
                        {conv.last_message.contenu}
                      </p>
                    )}

                  </div>

                </button>
              );
            })}

          </div>

        </div>

      </div>

      {/* =====================================================
          RIGHT - CHAT
      ===================================================== */}

      <div className="flex-1 min-w-0 bg-[#f5f7f8]">

        {selectedId ? (

          <ChatWindow
            conversationId={selectedId}
          />

        ) : (

          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
            "
          >

            {/* =================================================
                EMPTY CHAT ICON
            ================================================= */}

            <div
              className="
                w-20
                h-20
                rounded-2xl
                bg-white
                border
                border-[#e4edef]
                flex
                items-center
                justify-center
                mb-5
                shadow-[0_4px_18px_rgba(18,63,75,0.05)]
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                  flex
                  items-center
                  justify-center
                "
              >
                <IconMessageCircle className="w-6 h-6" />
              </div>

            </div>

            {/* =================================================
                TEXT
            ================================================= */}

            <h2
              className="
                text-[16px]
                font-semibold
                text-[#123F4B]
              "
            >
              Sélectionnez une conversation
            </h2>

            <p
              className="
                text-sm
                text-[#819399]
                mt-1.5
                max-w-[360px]
                leading-5
              "
            >
              Choisissez une discussion à gauche pour
              afficher vos messages.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}