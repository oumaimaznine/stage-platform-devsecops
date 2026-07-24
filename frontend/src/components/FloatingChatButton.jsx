import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // On cache le bouton si on est déjà sur la page Messages
  if (location.pathname.startsWith("/messages")) return null;

  return (
    <button
      onClick={() => navigate("/messages")}
      className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white w-14 h-14 rounded-full shadow-lg shadow-black/40 flex items-center justify-center transition hover:scale-105"
      title="Messages"
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
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </button>
  );
}
