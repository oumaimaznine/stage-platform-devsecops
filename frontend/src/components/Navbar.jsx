import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS_BY_ROLE = {
  etudiant: [
    { to: "/dashboard", label: "Tableau de bord" },
    { to: "/offers", label: "Offres" },
    { to: "/applications", label: "Mes candidatures" },
    { to: "/conventions", label: "Conventions" },
    { to: "/reports", label: "Rapports" },
    
  ],
  entreprise: [
    { to: "/dashboard", label: "Tableau de bord" },
    { to: "/offers", label: "Mes offres" },
    { to: "/applications", label: "Candidatures reçues" },
    { to: "/conventions", label: "Conventions" },
  
  ],
  admin: [
    { to: "/dashboard", label: "Tableau de bord" },
    { to: "/offers", label: "Offres" },
    { to: "/companies", label: "Entreprises" },
    { to: "/students", label: "Étudiants" },
    { to: "/applications", label: "Candidatures" },
    { to: "/conventions", label: "Conventions" },
    { to: "/reports", label: "Rapports" },
    { to: "/admin/validation", label: "Validation" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const links = LINKS_BY_ROLE[user.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-ink-900 border-b border-ink-800">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
              GS
            </div>
            <span className="font-semibold text-white text-sm hidden sm:inline">Gestion des stages</span>
          </div>

          <div className="hidden md:flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-primary-500/15 text-primary-400 font-medium"
                      : "text-ink-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-ink-300 hidden sm:inline">
            {user.name} <span className="text-ink-500">({user.role})</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-ink-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile links */}
      <div className="md:hidden flex flex-wrap gap-2 px-4 pb-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `text-xs px-2.5 py-1.5 rounded-lg transition ${
                isActive ? "bg-primary-500/15 text-primary-400 font-medium" : "text-ink-300 bg-white/5"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}