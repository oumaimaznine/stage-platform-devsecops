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

function IconBot({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="8" width="16" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8V4M9 4h6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="13" r="1" fill="currentColor" />
      <circle cx="15" cy="13" r="1" fill="currentColor" />
      <path d="M9 17h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const LINKS_BY_ROLE = {
  etudiant: [
    { to: "/dashboard", label: "Tableau de bord", icon: IconHome },
    { to: "/offers", label: "Offres", icon: IconBriefcase },
    { to: "/applications", label: "Mes candidatures", icon: IconInbox },
    { to: "/entretiens", label: "Entretiens", icon: IconCalendar },
    { to: "/conventions", label: "Conventions", icon: IconFileText },
    { to: "/reports", label: "Rapports", icon: IconClipboard },
    { to: "/assistant", label: "Assistant IA", icon: IconBot },
  ],
  entreprise: [
    { to: "/dashboard", label: "Tableau de bord", icon: IconHome },
    { to: "/offers", label: "Mes offres", icon: IconBriefcase },
    { to: "/applications", label: "Candidatures reçues", icon: IconInbox },
    { to: "/entretiens", label: "Entretiens", icon: IconCalendar },
    { to: "/conventions", label: "Conventions", icon: IconFileText },
    { to: "/assistant", label: "Assistant IA", icon: IconBot },
  ],
  admin: [
    { to: "/dashboard", label: "Tableau de bord", icon: IconHome },
    { to: "/offers", label: "Offres", icon: IconBriefcase },
    { to: "/companies", label: "Entreprises", icon: IconBuilding },
    { to: "/students", label: "Étudiants", icon: IconUsers },
    { to: "/applications", label: "Candidatures", icon: IconInbox },
    { to: "/entretiens", label: "Entretiens", icon: IconCalendar },
    { to: "/conventions", label: "Conventions", icon: IconFileText },
    { to: "/reports", label: "Rapports", icon: IconClipboard },
    { to: "/admin/validation", label: "Validation", icon: IconCheckCircle },
    { to: "/assistant", label: "Assistant IA", icon: IconBot },
  ],
};

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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Ouvrir le menu"
        className="md:hidden fixed top-3 left-3 z-40 bg-primary-800 border border-primary-700 text-primary-100 hover:text-white p-2 rounded-lg shadow-lg"
      >
        <IconMenu className="w-5 h-5" />
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="md:hidden fixed inset-0 bg-black/60 z-40"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 shrink-0 bg-gradient-to-b from-primary-700 via-primary-800 to-primary-900 border-r border-primary-900 flex flex-col z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center text-white font-bold text-sm shrink-0">
              GS
            </div>
            <span className="font-semibold text-white text-sm truncate">Gestion des stages</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="md:hidden text-primary-200 hover:text-white p-1 shrink-0"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "bg-white/15 text-white font-medium"
                      : "text-primary-100 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="relative shrink-0">
              <Avatar name={user.name} size="md" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-primary-800 rounded-full" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">{user.name}</p>
              <p className="text-xs text-primary-200 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-sm text-primary-100 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <IconLogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}