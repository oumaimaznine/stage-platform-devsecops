import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import FloatingChatButton from "./FloatingChatButton";
import NotificationBell from "./NotificationBell";
import Avatar from "./ui/Avatar";
import { useAuth } from "../context/AuthContext";

export default function Layout({ title, children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const photoUrl = user?.student?.photo_path
    ? `/storage/${user.student.photo_path}`
    : null;

  return (
    <div className="min-h-screen bg-[#f5f7f8] flex">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="flex-1 min-w-0 flex flex-col pt-14 md:pt-0">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <header
          className="
            sticky
            top-0
            z-30

            h-[70px]

            bg-[#123F4B]

            border-b
            border-[#0d3440]

            px-5
            md:px-7

            flex
            items-center
            justify-between

            shadow-[0_4px_18px_rgba(18,63,75,0.15)]

            transition-all
            duration-300
          "
        >

          {/* =================================================
              LEFT : TITLE
          ================================================= */}

          <div className="flex items-center gap-3 min-w-0">

            {/* Turquoise accent */}

            <div
              className="
                w-[4px]
                h-8

                rounded-full

                bg-[#11C7D7]

                shadow-[0_0_10px_rgba(17,199,215,0.35)]

                shrink-0
              "
            />

            <div className="min-w-0">

              <h1
                className="
                  text-[18px]
                  md:text-[20px]

                  font-bold

                  text-white

                  truncate
                "
              >
                {title}
              </h1>

              <p
                className="
                  hidden
                  sm:block

                  text-[10px]

                  text-[#9EDCE2]

                  mt-0.5
                "
              >
                Gestion des stages
              </p>

            </div>

          </div>

          {/* =================================================
              RIGHT : NOTIFICATION + FAVORIS + PROFILE
          ================================================= */}

          <div className="flex items-center gap-2 md:gap-3">

            {/* =================================================
                NOTIFICATION
            ================================================= */}

            <div
              className="
                w-10
                h-10

                rounded-xl

                flex
                items-center
                justify-center

                text-[#C8E8EB]

                hover:bg-white/10
                hover:text-[#11C7D7]

                transition-all
                duration-200

                cursor-pointer
              "
            >
              <NotificationBell />
            </div>

            {/* =================================================
                FAVORIS
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/favorites")}
              aria-label="Voir mes favoris"
              title="Mes favoris"
              className="
                w-10
                h-10

                rounded-xl

                flex
                items-center
                justify-center

                text-[#C8E8EB]

                hover:bg-white/10
                hover:text-[#11C7D7]

                transition-all
                duration-200

                cursor-pointer

                focus:outline-none
                focus:ring-2
                focus:ring-[#11C7D7]/30
              "
            >
              <svg
                className="w-[19px] h-[19px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="
                    M20.84 4.61
                    a5.5 5.5 0 0 0-7.78 0
                    L12 5.67
                    l-1.06-1.06
                    a5.5 5.5 0 0 0-7.78 7.78
                    L12 21.23
                    l8.84-8.84
                    a5.5 5.5 0 0 0 0-7.78
                    Z
                  "
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* =================================================
                SEPARATOR
            ================================================= */}

            <div
              className="
                hidden
                sm:block

                w-px
                h-7

                bg-white/10

                mx-1
              "
            />

            {/* =================================================
                PROFILE
            ================================================= */}

            <button
              type="button"
              onClick={() => navigate("/profile")}
              aria-label="Voir mon profil"
              className="
                group

                flex
                items-center
                gap-2.5

                px-2
                py-1.5

                rounded-xl

                hover:bg-white/10

                focus:outline-none
                focus:ring-2
                focus:ring-[#11C7D7]/30

                transition-all
                duration-200

                cursor-pointer
              "
            >

              {/* Avatar */}

              <div
                className="
                  relative

                  rounded-full

                  ring-2
                  ring-white/10

                  group-hover:ring-[#11C7D7]/50

                  transition-all
                  duration-200
                "
              >

                <Avatar
                  name={user?.name}
                  src={photoUrl}
                  size="md"
                />

                {/* Online */}

                <span
                  className="
                    absolute
                    right-0
                    bottom-0

                    w-2.5
                    h-2.5

                    rounded-full

                    bg-[#22c55e]

                    border-2
                    border-[#123F4B]
                  "
                />

              </div>

              {/* User info */}

              <div
                className="
                  hidden
                  md:block

                  text-left

                  max-w-[150px]
                "
              >

                <p
                  className="
                    text-[12px]

                    font-semibold

                    text-white

                    truncate
                  "
                >
                  {user?.name || "User"}
                </p>

                <p
                  className="
                    text-[10px]

                    text-[#9EDCE2]

                    capitalize

                    truncate

                    mt-0.5
                  "
                >
                  {user?.role || "Student"}
                </p>

              </div>

              {/* Arrow */}

              <svg
                className="
                  hidden
                  md:block

                  w-4
                  h-4

                  text-[#9EDCE2]

                  group-hover:text-[#11C7D7]

                  transition-colors
                  duration-200
                "
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="m6 9 6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

            </button>

          </div>

        </header>

        {/* ===================================================
            MAIN CONTENT
        ==================================================== */}

        <main
          className="
            flex-1
            min-w-0

            bg-[#f5f7f8]

            animate-[pageEnter_0.3s_ease-out]
          "
        >
          {children}
        </main>

      </div>

      {/* =====================================================
          FLOATING CHAT
      ====================================================== */}

      <FloatingChatButton />

      {/* =====================================================
          LIGHT PAGE ANIMATION
      ====================================================== */}

      <style>
        {`
          @keyframes pageEnter {
            from {
              opacity: 0;
              transform: translateY(4px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

    </div>
  );
}