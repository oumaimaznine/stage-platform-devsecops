import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonOfferCard } from "../components/ui/Skeleton";
import Avatar from "../components/ui/Avatar";
import NotificationBell from "../components/NotificationBell";
import {
  IconSearch,
  IconCalendar,
  IconBuilding,
  IconInbox,
  IconUpload,
  IconFile,
  IconX,
  IconBriefcase,
  IconMessageCircle,
} from "../components/ui/Icons";

const TYPE_META = {
  stage_ete: { label: "Stage d'été", tone: "amber" },
  pfe: { label: "PFE", tone: "violet" },
  stage_observation: { label: "Stage d'observation", tone: "sky" },
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });

function formatDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateFormatter.format(d);
}

function getTiming(dateDebut, dateFin) {
  const now = new Date();
  const start = new Date(dateDebut);
  const end = new Date(dateFin);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

  if (now < start) {
    const days = Math.ceil((start - now) / 86400000);
    return { label: days <= 1 ? "Débute demain" : `Débute dans ${days} j`, tone: "sky" };
  }
  if (now >= start && now <= end) {
    return { label: "En cours", tone: "emerald" };
  }
  return { label: "Terminée", tone: "neutral" };
}

// Petit en-tête de section coloré, réutilisé dans tout le modal
function SectionLegend({ children, color = "violet" }) {
  const dot = {
    violet: "bg-violet-500",
    sky: "bg-sky-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
  };
  const text = {
    violet: "text-violet-400",
    sky: "text-sky-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
  };
  return (
    <legend className={`font-semibold text-sm mb-2 flex items-center gap-2 ${text[color]}`}>
      <span className={`w-2 h-2 rounded-full ${dot[color]}`}></span>
      {children}
    </legend>
  );
}

function ApplyModal({ offer, user, onClose, onSubmitted }) {
  const { notify } = useToast();
  const dialogRef = useRef(null);
  const [cvFile, setCvFile] = useState(null);
  const [lettreFile, setLettreFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    telephone: user?.student?.telephone || "",
    filiere: user?.student?.filiere || "",
    niveau: user?.student?.niveau || "",
    adresse: "",
    message: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("input, textarea")?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvFile) {
      setError("Le CV est obligatoire.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (user?.student?.id) {
        await api.put(`/students/${user.student.id}`, {
          telephone: profile.telephone,
          filiere: profile.filiere,
          niveau: profile.niveau,
        });
      }

      const data = new FormData();
      data.append("internship_offer_id", offer.id);
      data.append("cv", cvFile);
      if (lettreFile) data.append("lettre_motivation", lettreFile);
      if (profile.message) data.append("message", profile.message);
      await api.post("/applications", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      notify("Candidature envoyée avec succès.", "success");
      onSubmitted();
    } catch (err) {
      setError("Impossible d'envoyer la candidature. Vérifie que le fichier est bien un PDF.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        className="bg-ink-900 border border-ink-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex justify-between items-center bg-gradient-to-r from-violet-600 to-indigo-600 p-4 shrink-0">
          <div>
            <h2 id="apply-modal-title" className="font-bold text-lg text-white leading-tight">
              Postuler
            </h2>
            <p className="text-sm text-white/80 mt-0.5">{offer.titre}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
            className="text-white/80 hover:text-white w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-4 space-y-5 overflow-y-auto flex-1">
            {error && (
              <p role="alert" className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2.5">
                {error}
              </p>
            )}

            <fieldset className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-3.5">
              <SectionLegend color="violet">Informations personnelles</SectionLegend>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ink-500" htmlFor="apply-name">
                    Nom complet
                  </label>
                  <input
                    id="apply-name"
                    type="text"
                    value={user?.name || ""}
                    disabled
                    className="bg-ink-800 border border-ink-700 p-2 w-full rounded-lg text-ink-500 text-sm mt-1 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-500" htmlFor="apply-email">
                    Email
                  </label>
                  <input
                    id="apply-email"
                    type="text"
                    value={user?.email || ""}
                    disabled
                    className="bg-ink-800 border border-ink-700 p-2 w-full rounded-lg text-ink-500 text-sm mt-1 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-500" htmlFor="apply-tel">
                    Téléphone
                  </label>
                  <input
                    id="apply-tel"
                    type="text"
                    placeholder="Ex: 06 00 00 00 00"
                    value={profile.telephone}
                    onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                    className="bg-white border border-violet-200 focus:border-violet-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-500" htmlFor="apply-adresse">
                    Adresse (optionnel)
                  </label>
                  <input
                    id="apply-adresse"
                    type="text"
                    placeholder="Ville, quartier..."
                    value={profile.adresse}
                    onChange={(e) => setProfile({ ...profile, adresse: e.target.value })}
                    className="bg-white border border-violet-200 focus:border-violet-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm mt-1"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-3.5">
              <SectionLegend color="sky">Informations académiques</SectionLegend>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ink-500" htmlFor="apply-filiere">
                    Filière
                  </label>
                  <input
                    id="apply-filiere"
                    type="text"
                    placeholder="Ex: Génie Informatique"
                    value={profile.filiere}
                    onChange={(e) => setProfile({ ...profile, filiere: e.target.value })}
                    className="bg-white border border-sky-200 focus:border-sky-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-500" htmlFor="apply-niveau">
                    Niveau
                  </label>
                  <input
                    id="apply-niveau"
                    type="text"
                    placeholder="Ex: Master 2"
                    value={profile.niveau}
                    onChange={(e) => setProfile({ ...profile, niveau: e.target.value })}
                    className="bg-white border border-sky-200 focus:border-sky-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-ink-500 mt-1.5">
                Ces champs mettent aussi à jour ton profil étudiant pour tes prochaines candidatures.
              </p>
            </fieldset>

            <fieldset className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3.5">
              <SectionLegend color="amber">Message à l'entreprise (optionnel)</SectionLegend>
              <textarea
                id="apply-message"
                placeholder="Explique brièvement ta motivation pour ce stage..."
                value={profile.message}
                maxLength={500}
                onChange={(e) => setProfile({ ...profile, message: e.target.value })}
                className="bg-white border border-amber-200 focus:border-amber-500 outline-none p-2 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm h-20 resize-none"
              />
              <p className="text-xs text-ink-500 text-right mt-1">{profile.message.length}/500</p>
            </fieldset>

            <fieldset className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5">
              <SectionLegend color="emerald">Documents</SectionLegend>
              <div className="space-y-3">
                <FileField
                  id="apply-cv"
                  label="CV (PDF)"
                  required
                  file={cvFile}
                  onChange={setCvFile}
                  color="emerald"
                />
                <FileField
                  id="apply-lettre"
                  label="Lettre de motivation (PDF, optionnel)"
                  file={lettreFile}
                  onChange={setLettreFile}
                  color="emerald"
                />
              </div>
            </fieldset>
          </div>

          <div className="flex gap-2 p-4 border-t border-ink-800 bg-ink-900 shrink-0">
            <Button type="submit" loading={submitting} className="!bg-violet-600 hover:!bg-violet-700">
              {submitting ? "Envoi en cours..." : "Envoyer ma candidature"}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileField({ id, label, required, file, onChange, color = "emerald" }) {
  const styles = {
    emerald: {
      filled: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
      empty: "border-emerald-500/40 hover:border-emerald-400 text-emerald-300 bg-emerald-500/5",
      icon: "text-emerald-400",
    },
  }[color];

  return (
    <div>
      <label className="text-xs text-ink-500 block mb-1" htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {file ? (
        <div className={`flex items-center justify-between border rounded-lg p-2.5 text-sm ${styles.filled}`}>
          <span className="flex items-center gap-2 truncate">
            <IconFile className={`w-4 h-4 shrink-0 ${styles.icon}`} />
            <span className="truncate">{file.name}</span>
          </span>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Retirer ${file.name}`}
            className="hover:text-red-400 shrink-0 cursor-pointer p-1"
          >
            <IconX className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className={`flex items-center gap-2 text-sm font-medium border border-dashed rounded-lg p-2.5 cursor-pointer transition-colors ${styles.empty}`}
        >
          <IconUpload className={`w-4 h-4 shrink-0 ${styles.icon}`} />
          Choisir un fichier PDF
          <input
            id={id}
            type="file"
            accept="application/pdf"
            required={required}
            onChange={(e) => onChange(e.target.files[0] || null)}
            className="sr-only"
          />
        </label>
      )}
    </div>
  );
}

export default function Offers() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [form, setForm] = useState({
    titre: "",
    description: "",
    competences_requises: "",
    date_debut: "",
    date_fin: "",
    type: "pfe",
  });
  const [applyingOffer, setApplyingOffer] = useState(null);
  const navigate = useNavigate();

  const startConversation = async (offer) => {
    try {
      const res = await api.post("/conversations", {
        company_id: offer.company_id,
        internship_offer_id: offer.id,
      });
      navigate(`/messages?conversation=${res.data.id}`);
    } catch {
      notify("Impossible de démarrer la conversation.", "error");
    }
  };

  const load = () => {
    setLoading(true);
    api
      .get("/offers")
      .then((res) => setOffers(res.data))
      .catch(() => notify("Impossible de charger les offres.", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/offers", form);
      setForm({ titre: "", description: "", competences_requises: "", date_debut: "", date_fin: "", type: "pfe" });
      setShowForm(false);
      notify("Offre publiée.", "success");
      load();
    } catch {
      notify("Impossible de publier l'offre.", "error");
    }
  };

  const handleApplySubmitted = () => {
    setApplyingOffer(null);
  };

  const filteredOffers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return offers.filter((offer) => {
      const matchesType = typeFilter === "all" || offer.type === typeFilter;
      const matchesSearch =
        !q ||
        offer.titre?.toLowerCase().includes(q) ||
        offer.company?.nom?.toLowerCase().includes(q) ||
        offer.competences_requises?.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [offers, search, typeFilter]);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-100">consultez les offres de stage disponibles.</h1>
          <p className="text-sm text-ink-500 mt-1">
            {loading ? "Chargement..." : `${filteredOffers.length} offre${filteredOffers.length > 1 ? "s" : ""} disponible${filteredOffers.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === "entreprise" && (
            <Button onClick={() => setShowForm((v) => !v)} className="!bg-violet-600 hover:!bg-violet-700">
              {showForm ? "Annuler" : "Publier une offre"}
            </Button>
          )}
          <NotificationBell />
          <Avatar name={user?.name} size="md" />
        </div>
      </div>

      {!loading && offers.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[220px]">
            <IconSearch className="w-4 h-4 text-ink-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un titre, une entreprise, une compétence..."
              aria-label="Rechercher une offre"
              className="w-full bg-white border border-ink-800 focus:border-violet-500 outline-none rounded-lg pl-9 pr-3 py-2.5 text-sm text-ink-100 placeholder-ink-500 shadow-card"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <FilterChip active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>
              Tous
            </FilterChip>
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <FilterChip key={key} active={typeFilter === key} onClick={() => setTypeFilter(key)}>
                {meta.label}
              </FilterChip>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-violet-200 p-4 rounded-xl mb-6 space-y-3 shadow-card"
        >
          <input
            placeholder="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            className="bg-white border border-ink-700 focus:border-violet-500 outline-none p-2.5 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="bg-white border border-ink-700 focus:border-violet-500 outline-none p-2.5 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
            required
          />
          <input
            placeholder="Compétences requises"
            value={form.competences_requises}
            onChange={(e) => setForm({ ...form, competences_requises: e.target.value })}
            className="bg-white border border-ink-700 focus:border-violet-500 outline-none p-2.5 w-full rounded-lg text-ink-100 placeholder-ink-500 text-sm"
          />
          <div className="flex gap-3">
            <input
              type="date"
              value={form.date_debut}
              onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
              className="bg-white border border-ink-700 focus:border-violet-500 outline-none p-2.5 w-full rounded-lg text-ink-100 text-sm"
              required
            />
            <input
              type="date"
              value={form.date_fin}
              onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
              className="bg-white border border-ink-700 focus:border-violet-500 outline-none p-2.5 w-full rounded-lg text-ink-100 text-sm"
              required
            />
          </div>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="bg-white border border-ink-700 focus:border-violet-500 outline-none p-2.5 w-full rounded-lg text-ink-100 text-sm"
          >
            {Object.entries(TYPE_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
          <Button type="submit" className="!bg-violet-600 hover:!bg-violet-700">
            Publier
          </Button>
        </form>
      )}

      {loading ? (
        <div className="grid gap-4">
          <SkeletonOfferCard />
          <SkeletonOfferCard />
          <SkeletonOfferCard />
        </div>
      ) : filteredOffers.length === 0 ? (
        <EmptyState
          icon={<IconInbox className="w-10 h-10" />}
          title={offers.length === 0 ? "Aucune offre disponible" : "Aucun résultat"}
          description={
            offers.length === 0
              ? user?.role === "entreprise"
                ? "Publie ta première offre pour commencer à recevoir des candidatures."
                : "Reviens plus tard, de nouvelles offres sont ajoutées régulièrement."
              : "Essaie un autre mot-clé ou change de filtre de type."
          }
          action={
            offers.length === 0 && user?.role === "entreprise" && !showForm ? (
              <Button onClick={() => setShowForm(true)} className="!bg-violet-600 hover:!bg-violet-700">
                Publier une offre
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredOffers.map((offer) => {
            const meta = TYPE_META[offer.type] ?? { label: offer.type, tone: "neutral" };
            const timing = getTiming(offer.date_debut, offer.date_fin);
            const competences = offer.competences_requises
              ?.split(",")
              .map((c) => c.trim())
              .filter(Boolean);

            return (
              <div
                key={offer.id}
                className="bg-white border border-ink-800 hover:border-violet-300 hover:shadow-md p-5 rounded-xl transition-all shadow-card"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar name={offer.company?.nom} square size="lg" />
                    <div className="min-w-0">
                      <h2 className="font-semibold text-ink-100 truncate">{offer.titre}</h2>
                      <p className="text-sm text-ink-300 flex items-center gap-1.5 mt-0.5">
                        <IconBuilding className="w-3.5 h-3.5 text-ink-500 shrink-0" />
                        {offer.company?.nom}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {timing && <Badge tone={timing.tone}>{timing.label}</Badge>}
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                  </div>
                </div>

                <p className="mt-3 text-sm text-ink-300 line-clamp-2">{offer.description}</p>

                {competences?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {competences.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-violet-500/10 text-violet-300 font-medium px-2.5 py-1 rounded-md"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-ink-500 mt-3 flex items-center gap-1.5">
                  <IconCalendar className="w-3.5 h-3.5" />
                  Du {formatDate(offer.date_debut)} au {formatDate(offer.date_fin)}
                </p>

                {user?.role === "etudiant" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => setApplyingOffer(offer)} className="!bg-violet-600 hover:!bg-violet-700">
                      <IconBriefcase className="w-3.5 h-3.5" />
                      Postuler
                    </Button>
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() => startConversation(offer)}
                      className="!bg-sky-500 hover:!bg-sky-600 !text-white"
                    >
                      <IconMessageCircle className="w-3.5 h-3.5" />
                      Contacter l'entreprise
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {applyingOffer && (
        <ApplyModal
          offer={applyingOffer}
          user={user}
          onClose={() => setApplyingOffer(null)}
          onSubmitted={handleApplySubmitted}
        />
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
        active
          ? "bg-violet-500/15 text-violet-600 border-violet-500/30"
          : "bg-white text-ink-300 border-ink-700 hover:border-ink-500 hover:text-ink-100"
      }`}
    >
      {children}
    </button>
  );
}