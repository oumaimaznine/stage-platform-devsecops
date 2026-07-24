import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "etudiant",
    filiere: "",
    niveau: "",
    nom_entreprise: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Erreur lors de l'inscription";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-ink-800 bg-white/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              GS
            </div>
            <span className="font-semibold text-ink-100 text-sm">Gestion des stages</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 grid lg:grid-cols-2">
        {/* Colonne gauche : formulaire */}
        <div className="flex items-center justify-center py-10 px-4 bg-ink-50/60">
          <form
            onSubmit={handleSubmit}
            className="max-w-md w-full space-y-4 bg-white border border-ink-800 p-8 rounded-xl shadow-card"
          >
            <h1 className="text-xl font-bold text-center text-ink-100">Inscription</h1>
            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">{error}</p>
            )}

            <div>
              <label className="text-sm text-ink-300">Je suis</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg mt-1 text-ink-100 text-sm"
              >
                <option value="etudiant">Étudiant</option>
                <option value="entreprise">Entreprise</option>
              </select>
            </div>

            <input
              name="name"
              placeholder="Nom complet"
              value={form.name}
              onChange={handleChange}
              className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
              required
            />
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmer le mot de passe"
              value={form.password_confirmation}
              onChange={handleChange}
              className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
              required
            />

            {form.role === "etudiant" && (
              <>
                <input
                  name="filiere"
                  placeholder="Filière"
                  value={form.filiere}
                  onChange={handleChange}
                  className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
                />
                <input
                  name="niveau"
                  placeholder="Niveau"
                  value={form.niveau}
                  onChange={handleChange}
                  className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
                />
              </>
            )}

            {form.role === "entreprise" && (
              <input
                name="nom_entreprise"
                placeholder="Nom de l'entreprise"
                value={form.nom_entreprise}
                onChange={handleChange}
                className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
              />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 w-full rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Création..." : "S'inscrire"}
            </button>

            <p className="text-sm text-center text-ink-300">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-primary-700 hover:text-primary-800 underline">
                Se connecter
              </Link>
            </p>
          </form>
        </div>

        {/* Colonne droite : aperçu illustré du site */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary-500/5 via-white to-ink-50 p-10 border-l border-ink-800 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />

          <div className="relative w-full max-w-md space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-ink-100 text-2xl font-bold">Gère tes stages simplement</h2>
              <p className="text-ink-500 text-sm mt-2">
                Offres, candidatures, conventions et rapports au même endroit.
              </p>
            </div>

            {/* Mockup du dashboard */}
            <div className="bg-white border border-ink-800 rounded-xl shadow-card p-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 bg-ink-50 border border-ink-800 rounded-lg p-3">
                  <p className="text-2xl font-bold text-ink-100">12</p>
                  <p className="text-xs text-ink-500">Candidatures</p>
                </div>
                <div className="flex-1 bg-ink-50 border border-ink-800 rounded-lg p-3">
                  <p className="text-2xl font-bold text-ink-100">4</p>
                  <p className="text-xs text-ink-500">Acceptées</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-4 border-primary-500 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                  70%
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-2 bg-primary-500/70 rounded-full w-4/5" />
                  <div className="h-2 bg-ink-800 rounded-full w-3/5" />
                  <div className="h-2 bg-ink-800 rounded-full w-2/5" />
                </div>
              </div>

              <div className="flex items-center gap-2 bg-ink-50 border border-ink-800 rounded-lg p-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  TC
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-ink-700 rounded-full w-3/4 mb-1.5" />
                  <div className="h-2 bg-ink-800 rounded-full w-1/2" />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              <span className="w-2 h-2 rounded-full bg-ink-800" />
              <span className="w-2 h-2 rounded-full bg-ink-800" />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-ink-800 py-5 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-ink-500">
          © {new Date().getFullYear()} Gestion des stages. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
