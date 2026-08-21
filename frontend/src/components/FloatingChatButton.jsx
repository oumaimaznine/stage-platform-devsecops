import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Masquer le bouton si on est déjà sur la page Messages
  if (location.pathname.startsWith("/messages")) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate("/messages")}
      aria-label="Ouvrir les messages"
      title="Messages"
      className="
        fixed
        bottom-6
        right-6
        z-50

        w-14
        h-14

        rounded-full

        bg-[#08B7C9]
        hover:bg-[#079FAF]

        text-white

        flex
        items-center
        justify-center

        shadow-[0_8px_25px_rgba(8,183,201,0.28)]

        transition-all
        duration-200

        hover:scale-105
        hover:-translate-y-0.5

        active:scale-95

        focus:outline-none
        focus:ring-4
        focus:ring-[#08B7C9]/20
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path
          d="
            M21 11.5
            a8.38 8.38 0 0 1-.9 3.8
            8.5 8.5 0 0 1-7.6 4.7
            8.38 8.38 0 0 1-3.8-.9
            L3 21
            l1.9-5.7
            a8.38 8.38 0 0 1-.9-3.8
            8.5 8.5 0 0 1 4.7-7.6
            8.38 8.38 0 0 1 3.8-.9
            h.5
            a8.48 8.48 0 0 1 8 8
            v.5
          "
        />
      </svg>
    </button>
  );
}