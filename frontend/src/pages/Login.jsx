import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const STATS = [
  { value: "500+", label: "Étudiants inscrits" },
  { value: "120+", label: "Entreprises partenaires" },
  { value: "800+", label: "Stages réalisés" },
];

const SERVICES = [
  {
    icon: "📋",
    title: "Offres de stage",
    text: "Publication et recherche d'offres adaptées à chaque filière.",
  },
  {
    icon: "📨",
    title: "Candidatures",
    text: "Dépôt de CV, lettres de motivation et suivi de statut en direct.",
  },
  {
    icon: "📄",
    title: "Conventions & rapports",
    text: "Dépôt et validation des conventions signées et des rapports de stage.",
  },
  {
    icon: "💬",
    title: "Messagerie",
    text: "Échange direct entre étudiants et entreprises, sans intermédiaire.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Crée ton profil",
    text: "Étudiant ou entreprise, inscris-toi en quelques minutes et complète ton profil.",
  },
  {
    n: "02",
    title: "Publie ou postule",
    text: "Les entreprises publient leurs offres, les étudiants postulent en un clic.",
  },
  {
    n: "03",
    title: "Échange en direct",
    text: "Discutez par messagerie intégrée pour organiser la suite sans quitter la plateforme.",
  },
  {
    n: "04",
    title: "Signe et suis ton stage",
    text: "Dépose la convention signée et le rapport final, validés par l'administration.",
  },
];

const TESTIMONIALS = [
  {
    initials: "SL",
    name: "Sara L.",
    role: "Étudiante en Génie Informatique",
    quote:
      "J'ai trouvé mon stage de fin d'études en deux semaines. Le suivi de candidature en temps réel m'a évité de relancer les entreprises par email.",
  },
  {
    initials: "KM",
    name: "Karim M.",
    role: "Responsable RH, entreprise partenaire",
    quote:
      "Publier une offre et échanger avec les candidats se fait au même endroit. On a divisé par deux le temps de traitement des candidatures.",
  },
  {
    initials: "YB",
    name: "Yasmine B.",
    role: "Étudiante en Master Marketing",
    quote:
      "Le dépôt de la convention et du rapport en ligne évite les allers-retours papier avec l'administration. Simple et rapide.",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Identifiants invalides");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="relative border-b border-ink-800 bg-white/95 backdrop-blur sticky top-0 z-40 overflow-hidden">
        {/* Décoration : halo dégradé discret derrière le header */}
        <div className="pointer-events-none absolute -top-16 left-1/3 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-[0_2px_10px_rgba(109,94,248,0.35)]">
              GS
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <p className="text-ink-100 font-semibold text-sm leading-tight">Gestion des stages</p>
              <p className="text-ink-500 text-xs leading-tight">Plateforme de suivi</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-ink-300">
            <a href="#accueil" className="relative hover:text-ink-100 transition-colors group">
              Accueil
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-primary-500 transition-all group-hover:w-full" />
            </a>
            <a href="#apropos" className="relative hover:text-ink-100 transition-colors group">
              À propos
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-primary-500 transition-all group-hover:w-full" />
            </a>
            <a href="#services" className="relative hover:text-ink-100 transition-colors group">
              Services
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-primary-500 transition-all group-hover:w-full" />
            </a>
            <a href="#contact" className="relative hover:text-ink-100 transition-colors group">
              Contact
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-primary-500 transition-all group-hover:w-full" />
            </a>
          </nav>

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-primary-700 border border-primary-500/30 bg-primary-500/10 px-3.5 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
            120+ entreprises partenaires
          </div>
        </div>
      </header>

      {/* Hero : formulaire à gauche, photo à droite */}
      <div id="accueil" className="relative flex-1 grid lg:grid-cols-2 bg-ink-50/60 overflow-hidden">
        {/* Décoration : halos dégradés */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(#d4d4d8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black 20%, transparent 70%)",
          }}
        />

        {/* Colonne gauche — formulaire */}
        <div className="relative flex items-center justify-center px-6 py-16">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white border border-ink-800 rounded-xl p-8 shadow-card"
          >
            <h1 className="text-xl font-bold text-ink-100 text-center mb-1">Authentification</h1>
            <p className="text-sm text-ink-500 text-center mb-6">Accède à ton espace étudiant ou entreprise</p>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
                {error}
              </p>
            )}

            <div className="mb-4">
              <label className="text-sm text-ink-300 block mb-1.5">Email</label>
              <input
                type="email"
                placeholder="Identifiant"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-ink-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-ink-100 placeholder-ink-500 p-2.5 w-full rounded-lg text-sm transition"
                required
              />
            </div>

            <div className="mb-6">
              <label className="text-sm text-ink-300 block mb-1.5">Mot de passe</label>
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border border-ink-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none text-ink-100 placeholder-ink-500 p-2.5 w-full rounded-lg text-sm transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 w-full rounded-lg text-sm transition disabled:opacity-50"
            >
              {submitting ? "Connexion..." : "Se connecter"}
            </button>

            <p className="text-sm text-center text-ink-500 mt-5">
              Pas encore inscrit ?{" "}
              <Link to="/register" className="text-primary-700 font-medium hover:underline">
                Créer un compte
              </Link>
            </p>
          </form>
        </div>

        {/* Colonne droite — photo */}
        <div className="hidden lg:flex items-center justify-center relative px-10 py-16">
          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-card border border-ink-800">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Étudiants collaborant sur un projet"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-2xl font-bold leading-tight mb-2 text-white">
                Connectez étudiants et entreprises
              </h2>
              <p className="text-white/85 text-sm max-w-md">
                Offres, candidatures, conventions, rapports et validation administrative,
                tout au même endroit.
              </p>
            </div>
          </div>

          {/* Carte flottante avec un chiffre clé */}
          <div className="absolute top-20 left-2 bg-white border border-ink-800 rounded-xl shadow-card px-5 py-4">
            <p className="text-2xl font-bold text-ink-100">800+</p>
            <p className="text-xs text-ink-500">Stages réalisés</p>
          </div>
        </div>
      </div>

      {/* Section : À propos */}
      <section id="apropos" className="border-t border-ink-800 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider text-primary-700 uppercase mb-3">
              À propos de nous
            </span>
            <h2 className="text-3xl font-bold text-ink-100 mb-5 leading-tight">
              Une plateforme pensée pour simplifier chaque étape du stage
            </h2>
            <p className="text-ink-300 leading-relaxed mb-6">
              Gestion des stages connecte étudiants et entreprises autour d'un même
              outil : publication d'offres, candidatures, conventions et rapports.
              Notre objectif est de réduire la charge administrative et d'accélérer
              la mise en relation entre les talents et les entreprises qui recrutent.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-ink-100">{s.value}</p>
                  <p className="text-xs text-ink-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-ink-800 h-72 lg:h-full shadow-card">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80"
              alt="Équipe au travail dans un bureau lumineux"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section : Nos services */}
      <section id="services" className="relative border-t border-ink-800 bg-ink-50/60 overflow-hidden">
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-wider text-primary-700 uppercase mb-3">
              Nos services
            </span>
            <h2 className="text-3xl font-bold text-ink-100 mb-4">Tout ce qu'il faut, au même endroit</h2>
            <p className="text-ink-300">
              De la recherche d'offre à la validation finale, chaque étape du stage
              est centralisée et suivie en temps réel.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-ink-800 hover:border-primary-500/40 rounded-xl p-6 shadow-card transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-primary-500/15 text-primary-700 flex items-center justify-center text-xl mb-4">
                  {s.icon}
                </div>
                <h3 className="text-ink-100 font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-ink-300 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section : Comment ça marche */}
      <section className="relative border-t border-ink-800 bg-white overflow-hidden">
        <div className="pointer-events-none absolute top-0 right-0 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-wider text-primary-700 uppercase mb-3">
              Comment ça marche
            </span>
            <h2 className="text-3xl font-bold text-ink-100 mb-4">Quatre étapes, du profil au rapport final</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                <div className="bg-white border border-ink-800 rounded-xl p-6 shadow-card h-full">
                  <span className="text-xs font-semibold text-primary-700">{step.n}</span>
                  <h3 className="text-ink-100 font-semibold mt-2 mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-300 leading-relaxed">{step.text}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-ink-800" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section : Témoignages */}
      <section className="border-t border-ink-800 bg-ink-50/60">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-xs font-semibold tracking-wider text-primary-700 uppercase mb-3">
              Ils utilisent la plateforme
            </span>
            <h2 className="text-3xl font-bold text-ink-100 mb-4">Ce qu'en disent étudiants et entreprises</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="relative bg-white border border-ink-800 rounded-xl p-6 shadow-card flex flex-col">
                <span className="absolute top-4 right-5 text-4xl leading-none text-primary-500/15 font-serif select-none">
                  "
                </span>
                <p className="text-sm text-ink-300 leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-10 h-10 rounded-full bg-primary-500/15 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-100">{t.name}</p>
                    <p className="text-xs text-ink-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section : Contact */}
      <section id="contact" className="border-t border-ink-800 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-semibold tracking-wider text-primary-700 uppercase mb-3">
              Contact
            </span>
            <h2 className="text-3xl font-bold text-ink-100 mb-4">Une question ? Contactez-nous</h2>
            <p className="text-ink-300 mb-8 max-w-md">
              Notre équipe vous répond sous 24h, du lundi au vendredi.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/15 text-primary-700 flex items-center justify-center shrink-0">
                  📧
                </div>
                <div>
                  <p className="text-xs text-ink-500">Email</p>
                  <a href="mailto:contact@gestiondesstages.com" className="text-ink-100 hover:text-primary-700 transition-colors">
                    contact@gestiondesstages.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/15 text-primary-700 flex items-center justify-center shrink-0">
                  📞
                </div>
                <div>
                  <p className="text-xs text-ink-500">Téléphone</p>
                  <a href="tel:+212500000000" className="text-ink-100 hover:text-primary-700 transition-colors">
                    +212 5 00 00 00 00
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-500/15 text-primary-700 flex items-center justify-center shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-xs text-ink-500">Adresse</p>
                  <p className="text-ink-100">Casablanca, Maroc</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-ink-800 rounded-xl p-8 shadow-card">
            <h3 className="text-ink-100 font-semibold mb-5">Envoyez-nous un message</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Votre nom"
                className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2.5 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm transition"
              />
              <input
                type="email"
                placeholder="Votre email"
                className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2.5 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm transition"
              />
              <textarea
                placeholder="Votre message"
                rows={4}
                className="bg-white border border-ink-700 focus:border-primary-500 outline-none p-2.5 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm resize-none transition"
              />
              <button
                type="button"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-4 py-2.5 w-full rounded-lg text-sm transition"
              >
                Envoyer le message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-800 py-4 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-between text-xs text-ink-500">
          <span>© 2025-2026 Gestion des stages</span>
          <span>Plateforme de suivi des stages</span>
        </div>
      </footer>
    </div>
  );
}
