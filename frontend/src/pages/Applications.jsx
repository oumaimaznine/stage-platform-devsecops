import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/ui/Avatar";

/* =========================================================
   STATUTS
========================================================= */

const STATUT_LABELS = {
  en_attente: "En attente",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

const STATUT_BADGE = {
  en_attente:
    "bg-[#EAFBFC] text-[#08B7C9] ring-1 ring-inset ring-[#c9e9ec]",

  acceptee:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",

  refusee:
    "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-200",
};

const STATUT_BAR = {
  en_attente: "bg-[#08B7C9]",
  acceptee: "bg-emerald-500",
  refusee: "bg-rose-500",
};

/* =========================================================
   ICONS
========================================================= */

const Icon = {
  search: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  ),

  eye: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  check: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M20 6L9 17l-5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  x: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M18 6L6 18M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  file: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 2v6h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  mail: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" strokeLinecap="round" />
    </svg>
  ),

  phone: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.3 1.8.6 2.7a2 2 0 01-.4 2.1L8.1 9.6a16 16 0 006.3 6.3l1.1-1.2a2 2 0 012.1-.4c.9.3 1.8.5 2.7.6a2 2 0 011.7 2.1z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  inbox: (p) => (
    <svg
      {...p}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M22 12h-6l-2 3h-4l-2-3H2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5.5 5h13l3.5 7v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* =========================================================
   INFO FIELD
========================================================= */

function InfoField({ label, value, icon }) {
  return (
    <div className="rounded-xl border border-[#e4edef] bg-[#f5f7f8] p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#819399]">
        {icon}
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#123F4B]">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAILS MODAL
========================================================= */

function DetailsModal({ app, onClose }) {
  if (!app) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#123F4B]/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e4edef] bg-white shadow-[0_20px_60px_rgba(18,63,75,0.20)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between bg-[#123F4B] p-5">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar
              name={app.student?.user?.name || "?"}
              size="md"
              square={false}
              className="ring-2 ring-[#08B7C9]/40"
            />

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold leading-tight text-white">
                {app.student?.user?.name || "Candidat"}
              </h2>

              <p className="truncate text-xs text-[#9ee7ec]">
                {app.offer?.titre || "Offre"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-all hover:bg-white/10 hover:text-[#08B7C9]"
          >
            <Icon.x className="h-4 w-4" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* Informations personnelles */}

          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#819399]">
              Informations personnelles
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoField
                icon={<Icon.mail className="h-3 w-3" />}
                label="Email"
                value={app.student?.user?.email || "—"}
              />

              <InfoField
                icon={<Icon.phone className="h-3 w-3" />}
                label="Téléphone"
                value={app.student?.telephone || "Non renseigné"}
              />
            </div>
          </div>

          {/* Formation */}

          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#819399]">
              Formation
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoField
                label="Filière"
                value={app.student?.filiere || "Non renseigné"}
              />

              <InfoField
                label="Niveau"
                value={app.student?.niveau || "Non renseigné"}
              />
            </div>
          </div>

          {/* Message */}

          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#819399]">
              Message du candidat
            </h3>

            <p className="rounded-xl border border-[#e4edef] bg-[#f5f7f8] p-3 text-sm leading-relaxed text-[#526970]">
              {app.message ||
                "Aucun message laissé par le candidat."}
            </p>
          </div>

          {/* Documents */}

          <div>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#819399]">
              Documents
            </h3>

            <div className="flex flex-wrap gap-2">
              {app.cv_path && (
                <a
                  href={`http://localhost:8000/storage/${app.cv_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9e9ec] bg-[#EAFBFC] px-3 py-2 text-sm font-medium text-[#08B7C9] transition-all hover:bg-[#d9f7f9]"
                >
                  <Icon.file className="h-3.5 w-3.5" />
                  Voir le CV
                </a>
              )}

              {app.lettre_motivation_path && (
                <a
                  href={`http://localhost:8000/storage/${app.lettre_motivation_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#c9e9ec] bg-[#EAFBFC] px-3 py-2 text-sm font-medium text-[#08B7C9] transition-all hover:bg-[#d9f7f9]"
                >
                  <Icon.mail className="h-3.5 w-3.5" />
                  Voir la lettre
                </a>
              )}

              {!app.cv_path &&
                !app.lettre_motivation_path && (
                  <p className="text-sm italic text-[#94A4A9]">
                    Aucun document fourni.
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* FOOTER */}

        <div className="shrink-0 border-t border-[#e4edef] bg-[#f5f7f8] p-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-[#08B7C9] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#079faf] hover:shadow-md"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ label, value, accent, icon }) {
  return (
    <div
      className="
        flex-1
        rounded-2xl
        border
        border-[#e4edef]
        bg-white
        p-5
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-[#c9e9ec]
        hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#819399]">
            {label}
          </p>

          <p
            className={`mt-1 text-[28px] font-bold ${accent}`}
          >
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBFC] text-[#08B7C9]">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SKELETON
========================================================= */

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#e4edef] bg-white p-5 shadow-[0_3px_15px_rgba(18,63,75,0.045)]">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-full bg-[#e4edef]" />

        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-[#e4edef]" />
          <div className="h-3 w-1/4 rounded bg-[#f0f4f5]" />
        </div>

        <div className="h-6 w-20 shrink-0 rounded-full bg-[#f0f4f5]" />
      </div>
    </div>
  );
}

/* =========================================================
   APPLICATIONS
========================================================= */

export default function Applications() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("toutes");
  const [error, setError] = useState("");

  /* =======================================================
     LOAD
  ======================================================= */

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/applications");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setApplications(data);
    } catch (err) {
      console.error(
        "Erreur lors du chargement des candidatures :",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Impossible de charger les candidatures."
      );

      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* =======================================================
     CHANGE STATUS
  ======================================================= */

  const handleStatusChange = async (id, statut) => {
    try {
      setError("");

      await api.patch(`/applications/${id}/statut`, {
        statut,
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id
            ? {
                ...app,
                statut,
              }
            : app
        )
      );

      setSelectedApp((prev) =>
        prev?.id === id
          ? {
              ...prev,
              statut,
            }
          : prev
      );
    } catch (err) {
      console.error(
        "Erreur lors de la modification du statut :",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Impossible de modifier le statut de la candidature."
      );
    }
  };

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    return {
      total: applications.length,

      en_attente: applications.filter(
        (app) => app.statut === "en_attente"
      ).length,

      acceptee: applications.filter(
        (app) => app.statut === "acceptee"
      ).length,

      refusee: applications.filter(
        (app) => app.statut === "refusee"
      ).length,
    };
  }, [applications]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filtered = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return applications.filter((app) => {
      const matchesStatus =
        statusFilter === "toutes" ||
        app.statut === statusFilter;

      const haystack = `
        ${app.offer?.titre || ""}
        ${app.offer?.company?.nom || ""}
        ${app.student?.user?.name || ""}
      `.toLowerCase();

      const matchesSearch =
        !searchValue || haystack.includes(searchValue);

      return matchesStatus && matchesSearch;
    });
  }, [applications, search, statusFilter]);

  /* =======================================================
     FILTERS
  ======================================================= */

  const FILTERS = [
    {
      key: "toutes",
      label: "Toutes",
    },
    {
      key: "en_attente",
      label: "En attente",
    },
    {
      key: "acceptee",
      label: "Acceptées",
    },
    {
      key: "refusee",
      label: "Refusées",
    },
  ];

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] px-5 py-7 md:px-8">

      <div className="mx-auto max-w-[1150px]">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">
          <h1 className="text-[27px] font-bold text-[#123F4B] md:text-[30px]">
            Candidatures
          </h1>

        
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-5 flex items-start justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0 font-semibold hover:text-rose-900"
            >
              ×
            </button>
          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-7 flex flex-wrap justify-center gap-4">

          <StatCard
            label="Total"
            value={stats.total}
            accent="text-[#123F4B]"
            icon={<Icon.inbox className="h-5 w-5" />}
          />

          <StatCard
            label="En attente"
            value={stats.en_attente}
            accent="text-[#08B7C9]"
            icon={<Icon.file className="h-5 w-5" />}
          />

          <StatCard
            label="Acceptées"
            value={stats.acceptee}
            accent="text-emerald-600"
            icon={<Icon.check className="h-5 w-5" />}
          />

          <StatCard
            label="Refusées"
            value={stats.refusee}
            accent="text-rose-600"
            icon={<Icon.x className="h-5 w-5" />}
          />

        </div>

        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="relative w-full sm:max-w-lg">

            <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#819399]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une offre, une entreprise..."
              className="
                w-full
                rounded-xl
                border
                border-[#e4edef]
                bg-white
                py-2.5
                pl-9
                pr-3
                text-sm
                text-[#123F4B]
                placeholder:text-[#94A4A9]
                shadow-[0_3px_15px_rgba(18,63,75,0.035)]
                outline-none
                transition-all
                focus:border-[#c9e9ec]
                focus:ring-2
                focus:ring-[#08B7C9]/15
              "
            />

          </div>

          <div className="flex flex-wrap gap-1.5">

            {FILTERS.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() =>
                  setStatusFilter(filter.key)
                }
                className={`
                  rounded-full
                  px-3.5
                  py-1.5
                  text-xs
                  font-semibold
                  transition-all
                  ${
                    statusFilter === filter.key
                      ? "bg-[#08B7C9] text-white shadow-sm"
                      : "bg-white text-[#819399] ring-1 ring-inset ring-[#e4edef] hover:bg-[#EAFBFC] hover:text-[#08B7C9]"
                  }
                `}
              >
                {filter.label}
              </button>
            ))}

          </div>
        </div>

        {/* =================================================
            LIST
        ================================================= */}

        {loading ? (

          <div className="grid gap-3">
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>

        ) : filtered.length === 0 ? (

          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dcecef] bg-white py-16 text-center shadow-[0_3px_15px_rgba(18,63,75,0.035)]">

            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAFBFC] text-[#08B7C9]">
              <Icon.inbox className="h-6 w-6" />
            </div>

            <p className="font-semibold text-[#123F4B]">
              Aucune candidature trouvée
            </p>

            <p className="mt-1 text-sm text-[#94A4A9]">
              {search || statusFilter !== "toutes"
                ? "Essayez de modifier vos filtres de recherche."
                : "Vos candidatures apparaîtront ici."}
            </p>

          </div>

        ) : (

          <div className="grid gap-3">

            {filtered.map((app) => {

              const statusLabel =
                STATUT_LABELS[app.statut] ||
                app.statut ||
                "Inconnu";

              const statusBadge =
                STATUT_BADGE[app.statut] ||
                "bg-[#f5f7f8] text-[#526970] ring-1 ring-inset ring-[#e4edef]";

              const statusBar =
                STATUT_BAR[app.statut] ||
                "bg-[#94A4A9]";

              return (
                <div
                  key={app.id}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#e4edef]
                    bg-white
                    p-5
                    shadow-[0_3px_15px_rgba(18,63,75,0.045)]
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                    hover:border-[#c9e9ec]
                    hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
                  "
                >

                  {/* STATUS BAR */}

                  <span
                    className={`absolute inset-y-0 left-0 w-1 ${statusBar}`}
                  />

                  <div className="flex items-start justify-between gap-4 pl-2">

                    <div className="flex min-w-0 items-start gap-3">

                      <Avatar
                        name={
                          user?.role === "etudiant"
                            ? app.offer?.company?.nom ||
                              "Entreprise"
                            : app.student?.user?.name ||
                              "Candidat"
                        }
                        size="md"
                      />

                      <div className="min-w-0">

                        <h2 className="truncate font-semibold text-[#123F4B]">
                          {app.offer?.titre ||
                            "Offre sans titre"}
                        </h2>

                        <p className="truncate text-sm text-[#819399]">
                          {app.offer?.company?.nom ||
                            "Entreprise non renseignée"}
                        </p>

                        {user?.role !== "etudiant" && (
                          <p className="mt-0.5 truncate text-sm text-[#819399]">
                            Candidat :{" "}
                            <span className="font-medium text-[#526970]">
                              {app.student?.user?.name ||
                                "Nom non renseigné"}
                            </span>
                          </p>
                        )}

                        {/* DOCUMENTS */}

                        <div className="mt-2 flex flex-wrap gap-3 text-xs">

                          {app.cv_path && (
                            <a
                              href={`http://localhost:8000/storage/${app.cv_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-[#08B7C9] transition-colors hover:text-[#079faf]"
                            >
                              <Icon.file className="h-3 w-3" />
                              CV
                            </a>
                          )}

                          {app.lettre_motivation_path && (
                            <a
                              href={`http://localhost:8000/storage/${app.lettre_motivation_path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-medium text-[#08B7C9] transition-colors hover:text-[#079faf]"
                            >
                              <Icon.mail className="h-3 w-3" />
                              Lettre de motivation
                            </a>
                          )}

                        </div>

                      </div>

                    </div>

                    {/* STATUS */}

                    <span
                      className={`
                        shrink-0
                        whitespace-nowrap
                        rounded-full
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        ${statusBadge}
                      `}
                    >
                      {statusLabel}
                    </span>

                  </div>

                  {/* ACTIONS */}

                  <div className="mt-4 flex flex-wrap gap-2 pl-2">

                    {user?.role === "entreprise" && (
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedApp(app)
                        }
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          rounded-lg
                          bg-[#08B7C9]
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          text-white
                          shadow-sm
                          transition-all
                          hover:bg-[#079faf]
                          hover:shadow-md
                        "
                      >
                        <Icon.eye className="h-3.5 w-3.5" />
                        Voir le profil
                      </button>
                    )}

                    {user?.role === "entreprise" &&
                      app.statut === "en_attente" && (
                        <>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                app.id,
                                "acceptee"
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-lg
                              bg-emerald-600
                              px-3
                              py-1.5
                              text-sm
                              font-medium
                              text-white
                              shadow-sm
                              transition-all
                              hover:bg-emerald-700
                            "
                          >
                            <Icon.check className="h-3.5 w-3.5" />
                            Accepter
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                app.id,
                                "refusee"
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-lg
                              border
                              border-rose-200
                              bg-rose-50
                              px-3
                              py-1.5
                              text-sm
                              font-medium
                              text-rose-600
                              transition-all
                              hover:bg-rose-100
                            "
                          >
                            <Icon.x className="h-3.5 w-3.5" />
                            Refuser
                          </button>

                        </>
                      )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {selectedApp && (
        <DetailsModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

    </div>
  );
}