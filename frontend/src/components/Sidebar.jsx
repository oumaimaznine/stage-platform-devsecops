import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./ui/Avatar";

import {
  IconHome,
  IconBriefcase,
  IconInbox,
  IconFileText,
  IconClipboard,
  IconCalendar,
  IconBuilding,
  IconUsers,
  IconCheckCircle,
  IconMenu,
  IconX,
  IconLogOut,
} from "./ui/Icons";

/* =========================================================
   AI ASSISTANT ICON
========================================================= */

function IconBot({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="4"
        y="8"
        width="16"
        height="12"
        rx="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 8V4M9 4h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />

      <path
        d="M9 17h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   LINKS BY ROLE
========================================================= */

const LINKS_BY_ROLE = {
  etudiant: [
    {
      to: "/dashboard",
      label: "Tableau de bord",
      icon: IconHome,
    },
    {
      to: "/offers",
      label: "Offres",
      icon: IconBriefcase,
    },
    {
      to: "/applications",
      label: "Mes candidatures",
      icon: IconInbox,
    },
    {
      to: "/entretiens",
      label: "Entretiens",
      icon: IconCalendar,
    },
    {
      to: "/conventions",
      label: "Conventions",
      icon: IconFileText,
    },
    {
      to: "/reports",
      label: "Rapports",
      icon: IconClipboard,
    },
    {
      to: "/profile",
      label: "Mon profil",
      icon: IconUsers,
    },
    {
      to: "/assistant",
      label: "Assistant IA",
      icon: IconBot,
    },
  ],

  entreprise: [
    {
      to: "/dashboard",
      label: "Tableau de bord",
      icon: IconHome,
    },
    {
      to: "/offers",
      label: "Mes offres",
      icon: IconBriefcase,
    },
    {
      to: "/applications",
      label: "Candidatures reçues",
      icon: IconInbox,
    },
    {
      to: "/entretiens",
      label: "Entretiens",
      icon: IconCalendar,
    },
    {
      to: "/conventions",
      label: "Conventions",
      icon: IconFileText,
    },
    {
      to: "/assistant",
      label: "Assistant IA",
      icon: IconBot,
    },
  ],

  admin: [
    {
      to: "/dashboard",
      label: "Tableau de bord",
      icon: IconHome,
    },
    {
      to: "/offers",
      label: "Offres",
      icon: IconBriefcase,
    },
    {
      to: "/companies",
      label: "Entreprises",
      icon: IconBuilding,
    },
    {
      to: "/students",
      label: "Étudiants",
      icon: IconUsers,
    },
    {
      to: "/applications",
      label: "Candidatures",
      icon: IconInbox,
    },
    {
      to: "/entretiens",
      label: "Entretiens",
      icon: IconCalendar,
    },
    {
      to: "/conventions",
      label: "Conventions",
      icon: IconFileText,
    },
    {
      to: "/reports",
      label: "Rapports",
      icon: IconClipboard,
    },
    {
      to: "/admin/validation",
      label: "Validation",
      icon: IconCheckCircle,
    },
    {
      to: "/assistant",
      label: "Assistant IA",
      icon: IconBot,
    },
  ],
};

/* =========================================================
   SIDEBAR
========================================================= */

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  if (!user) return null;

  const links = LINKS_BY_ROLE[user.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const photoUrl = user.student?.photo_path
    ? `/storage/${user.student.photo_path}`
    : null;

  return (
    <>
      {/* =====================================================
          MOBILE MENU BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        className="
          md:hidden
          fixed
          top-3
          left-3
          z-40

          w-10
          h-10

          rounded-xl

          bg-[#123F4B]
          border
          border-white/10

          text-white

          flex
          items-center
          justify-center

          shadow-[0_6px_18px_rgba(18,63,75,0.25)]

          hover:bg-[#164b59]
          hover:scale-[1.03]

          transition-all
          duration-200
        "
      >
        <IconMenu className="w-5 h-5" />
      </button>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="
            md:hidden
            fixed
            inset-0
            bg-black/30
            backdrop-blur-[2px]
            z-40

            animate-[overlayIn_0.2s_ease-out]
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          md:sticky

          top-0
          left-0

          h-screen
          w-[250px]

          shrink-0

          flex
          flex-col

          z-50

          bg-[#123F4B]

          border-r
          border-[#0d3440]

          shadow-[5px_0_25px_rgba(0,0,0,0.08)]

          transition-transform
          duration-300
          ease-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* ===================================================
            LOGO
        ==================================================== */}

        <div
          className="
            h-[70px]

            px-5

            flex
            items-center
            justify-between

            border-b
            border-white/10

            shrink-0
          "
        >

          <div className="flex items-center gap-3 min-w-0">

            {/* LOGO */}

            <div
              className="
                w-10
                h-10

                rounded-xl

                bg-gradient-to-br
                from-[#11C7D7]
                to-[#08B7C9]

                flex
                items-center
                justify-center

                text-white
                font-bold
                text-sm

                shrink-0

                shadow-[0_5px_16px_rgba(8,183,201,0.28)]
              "
            >
              GS
            </div>

            {/* BRAND */}

            <div className="min-w-0">

              <p
                className="
                  text-white
                  font-bold
                  text-[13px]
                  truncate
                "
              >
                Gestion des stages
              </p>

              <p
                className="
                  text-[#9edce2]
                  text-[10px]
                  truncate
                  mt-0.5
                "
              >
                Internship Platform
              </p>

            </div>

          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="
              md:hidden

              w-8
              h-8

              rounded-lg

              flex
              items-center
              justify-center

              text-[#9edce2]

              hover:bg-white/10
              hover:text-white

              transition-all
              duration-200
            "
          >
            <IconX className="w-4 h-4" />
          </button>

        </div>

        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto

            px-3
            py-5

            space-y-1
          "
        >

          {/* SECTION */}

          <p
            className="
              px-3
              mb-3

              text-[10px]
              font-semibold

              uppercase
              tracking-[0.14em]

              text-[#72aab2]
            "
          >
            Navigation
          </p>

          {/* LINKS */}

          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                    group

                    relative

                    flex
                    items-center
                    gap-3

                    px-3
                    py-2.5

                    rounded-xl

                    text-[13px]

                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-white/10
                          text-[#11C7D7]
                          font-semibold
                        `
                        : `
                          text-[#D5EEF0]
                          font-medium

                          hover:bg-white/[0.06]
                          hover:text-white
                        `
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* ACTIVE BAR */}

                    {isActive && (
                      <span
                        className="
                          absolute

                          left-0
                          top-1/2

                          -translate-y-1/2

                          w-[3px]
                          h-6

                          rounded-r-full

                          bg-[#11C7D7]

                          shadow-[0_0_10px_rgba(17,199,215,0.4)]
                        "
                      />
                    )}

                    {/* ICON */}

                    <span
                      className={`
                        w-5
                        h-5

                        shrink-0

                        flex
                        items-center
                        justify-center

                        transition-transform
                        duration-200

                        ${
                          isActive
                            ? "scale-105"
                            : "group-hover:translate-x-[1px]"
                        }
                      `}
                    >
                      <Icon className="w-[17px] h-[17px]" />
                    </span>

                    {/* TEXT */}

                    <span className="truncate">
                      {link.label}
                    </span>

                    {/* ACTIVE DOT */}

                    {isActive && (
                      <span
                        className="
                          ml-auto

                          w-1.5
                          h-1.5

                          rounded-full

                          bg-[#11C7D7]

                          shadow-[0_0_7px_rgba(17,199,215,0.45)]
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ===================================================
            USER SECTION
        ==================================================== */}

        <div
          className="
            p-3

            border-t
            border-white/10

            shrink-0

            space-y-2
          "
        >

          {/* USER */}

          <div
            className="
              flex
              items-center
              gap-3

              px-3
              py-2.5

              rounded-xl

              bg-white/[0.06]

              border
              border-white/[0.05]

              transition-all
              duration-200

              hover:bg-white/[0.09]
            "
          >

            {/* AVATAR */}

            <div className="relative shrink-0">

              <div
                className="
                  rounded-full

                  ring-2
                  ring-[#123F4B]
                "
              >
                <Avatar
                  name={user.name}
                  src={photoUrl}
                  size="md"
                />
              </div>

              {/* ONLINE */}

              <span
                className="
                  absolute
                  bottom-0
                  right-0

                  w-2.5
                  h-2.5

                  bg-[#22c55e]

                  border-2
                  border-[#123F4B]

                  rounded-full
                "
              />

            </div>

            {/* USER INFO */}

            <div className="min-w-0">

              <p
                className="
                  text-[12px]
                  font-semibold

                  text-white

                  truncate
                "
              >
                {user.name}
              </p>

              <p
                className="
                  text-[10px]

                  text-[#8fc5cc]

                  capitalize
                  truncate

                  mt-0.5
                "
              >
                {user.role}
              </p>

            </div>

          </div>

          {/* LOGOUT */}

          <button
            onClick={handleLogout}
            className="
              group

              w-full

              flex
              items-center
              gap-2.5

              px-3
              py-2.5

              rounded-xl

              text-[12px]
              font-medium

              text-[#D5EEF0]

              hover:bg-red-500/10
              hover:text-[#ff9c9c]

              transition-all
              duration-200

              cursor-pointer
            "
          >
            <IconLogOut
              className="
                w-[17px]
                h-[17px]

                transition-transform
                duration-200

                group-hover:translate-x-0.5
              "
            />

            <span>
              Déconnexion
            </span>
          </button>

        </div>

      </aside>

      {/* =====================================================
          LIGHT ANIMATION
      ====================================================== */}

      <style>
        {`
          @keyframes overlayIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </>
  );
}