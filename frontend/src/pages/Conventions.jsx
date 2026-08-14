import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   STATUTS
========================================================= */

const STATUT_LABELS = {
  en_preparation: "En préparation",
  signee: "Signée",
  validee_admin: "Validée",
  rejetee: "Rejetée",
};

const STATUT_COLORS = {
  en_preparation:
    "bg-[#f3f6f7] text-[#526970] ring-1 ring-inset ring-[#dce7e9]",

  signee:
    "bg-[#fff8e8] text-[#b77908] ring-1 ring-inset ring-[#f7df9c]",

  validee_admin:
    "bg-[#ecfdf3] text-[#16803a] ring-1 ring-inset ring-[#bbf0cf]",

  rejetee:
    "bg-[#fff1f2] text-[#dc2626] ring-1 ring-inset ring-[#fecdd3]",
};

const STATUT_BAR = {
  en_preparation: "bg-[#819399]",
  signee: "bg-[#F59E0B]",
  validee_admin: "bg-[#22C55E]",
  rejetee: "bg-[#EF4444]",
};

/* =========================================================
   ICONS
========================================================= */

const Icon = {
  file: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M14 2v6h6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8 13h8M8 17h6"
        strokeLinecap="round"
      />
    </svg>
  ),

  upload: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M12 16V4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="m8 8 4-4 4 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
        strokeLinecap="round"
      />
    </svg>
  ),

  eye: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="12" cy="12" r="3" />
    </svg>
  ),

  check: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="m5 12 4 4L19 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  clock: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />

      <path
        d="M12 7v5l3 2"
        strokeLinecap="round"
      />
    </svg>
  ),

  building: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"
        strokeLinecap="round"
      />

      <path
        d="M16 9h3a1 1 0 0 1 1 1v11M8 7h4M8 11h4M8 15h4M8 19h4M2 21h20"
        strokeLinecap="round"
      />
    </svg>
  ),

  graduation: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="m3 9 9-5 9 5-9 5-9-5Z"
        strokeLinejoin="round"
      />

      <path
        d="M7 12v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4"
        strokeLinecap="round"
      />

      <path
        d="M21 10v5"
        strokeLinecap="round"
      />
    </svg>
  ),

  search: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />

      <path
        d="m20 20-4-4"
        strokeLinecap="round"
      />
    </svg>
  ),

  alert: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M10.3 4.3 2.2 18a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z"
        strokeLinejoin="round"
      />

      <path
        d="M12 9v4M12 17h.01"
        strokeLinecap="round"
      />
    </svg>
  ),

  x: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M6 6l12 12M18 6 6 18"
        strokeLinecap="round"
      />
    </svg>
  ),

  refresh: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M3 5v5h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M21 19v-5h-5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  description,
  iconClass,
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-[#e4edef]
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
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#819399]">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-[#123F4B]">
            {value}
          </p>

          <p className="mt-1 text-xs text-[#94A4A9]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS TIMELINE
========================================================= */

function StatusTimeline({ status }) {
  const steps = [
    {
      key: "en_preparation",
      label: "Préparation",
    },
    {
      key: "signee",
      label: "Signée",
    },
    {
      key: "validee_admin",
      label: "Validée",
    },
  ];

  if (status === "rejetee") {
    return (
      <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-[#EF4444]">
            <Icon.alert className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold text-red-800">
              Convention rejetée
            </p>

            <p className="mt-0.5 text-xs text-red-600">
              Consultez le commentaire associé à la convention.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex(
    (step) => step.key === status
  );

  return (
    <div className="mt-6">
      <div className="flex items-start">
        {steps.map((step, index) => {
          const completed = index <= currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={step.key}
              className={`flex flex-1 items-start ${
                index !== steps.length - 1
                  ? "after:mt-4 after:h-0.5 after:flex-1 after:content-['']"
                  : ""
              } ${
                index !== steps.length - 1 && completed
                  ? "after:bg-[#08B7C9]"
                  : index !== steps.length - 1
                    ? "after:bg-[#e4edef]"
                    : ""
              }`}
            >
              <div className="flex min-w-0 flex-col items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    completed
                      ? "border-[#08B7C9] bg-[#08B7C9] text-white"
                      : "border-[#dce7e9] bg-white text-[#94A4A9]"
                  } ${
                    active
                      ? "ring-4 ring-[#EAFBFC]"
                      : ""
                  }`}
                >
                  {completed ? (
                    <Icon.check className="h-4 w-4" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </div>

                <span
                  className={`mt-2 text-center text-[11px] font-medium ${
                    active
                      ? "text-[#123F4B]"
                      : "text-[#94A4A9]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   CONVENTION CARD
========================================================= */

function ConventionCard({ conv, role }) {
  const statusLabel =
    STATUT_LABELS[conv.statut] || "Statut inconnu";

  const statusColor =
    STATUT_COLORS[conv.statut] ||
    "bg-[#f3f6f7] text-[#526970] ring-1 ring-inset ring-[#dce7e9]";

  const statusBar =
    STATUT_BAR[conv.statut] || "bg-[#819399]";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border border-[#e4edef]
        bg-white
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-[#c9e9ec]
        hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
      "
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${statusBar}`}
      />

      <div className="p-5 sm:p-6">

        {/* Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAFBFC] text-[#08B7C9]">
              <Icon.file className="h-5 w-5" />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-base font-bold text-[#123F4B]">
                {conv.application?.offer?.titre ||
                  "Convention de stage"}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#819399]">

                <span className="inline-flex items-center gap-1">
                  <Icon.building className="h-3.5 w-3.5" />

                  {conv.application?.offer?.company?.nom ||
                    "Entreprise non renseignée"}
                </span>

                {role === "entreprise" &&
                  conv.application?.student?.user?.name && (
                    <>
                      <span className="text-[#cbd8db]">
                        •
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Icon.graduation className="h-3.5 w-3.5" />

                        {conv.application.student.user.name}
                      </span>
                    </>
                  )}
              </div>
            </div>
          </div>

          <span
            className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Timeline */}

        <StatusTimeline status={conv.statut} />

        {/* Informations */}

        <div className="mt-6 border-t border-[#e4edef] pt-4">

          <div className="grid gap-3 sm:grid-cols-2">

            {role === "etudiant" && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A4A9]">
                  Entreprise
                </p>

                <p className="mt-1 text-sm text-[#526970]">
                  {conv.application?.offer?.company?.nom ||
                    "Non renseignée"}
                </p>
              </div>
            )}

            {role === "entreprise" && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#94A4A9]">
                  Stagiaire
                </p>

                <p className="mt-1 text-sm text-[#526970]">
                  {conv.application?.student?.user?.name ||
                    "Étudiant non renseigné"}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A4A9]">
                Offre
              </p>

              <p className="mt-1 text-sm text-[#526970]">
                {conv.application?.offer?.titre ||
                  "Offre non renseignée"}
              </p>
            </div>

          </div>
        </div>

        {/* Commentaire */}

        <div className="mt-4 border-t border-[#e4edef] pt-4">

          {conv.commentaire_admin ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#94A4A9]">
                Commentaire
              </p>

              <p className="mt-1 text-sm text-[#526970]">
                {conv.commentaire_admin}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[#94A4A9]">
              Aucun commentaire pour le moment.
            </p>
          )}

        </div>

        {/* Fichier */}

        {conv.fichier_path && (
          <div className="mt-4 flex justify-end border-t border-[#e4edef] pt-4">

            <a
              href={`http://localhost:8000/storage/${conv.fichier_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#dce7e9]
                bg-white
                px-3.5
                py-2
                text-sm
                font-semibold
                text-[#526970]
                shadow-sm
                transition-all
                hover:border-[#b9e7eb]
                hover:bg-[#EAFBFC]
                hover:text-[#08B7C9]
              "
            >
              <Icon.eye className="h-4 w-4" />

              Voir la convention
            </a>

          </div>
        )}

      </div>
    </div>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function Conventions() {
  const { user } = useAuth();

  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Étudiant
  const [acceptedApplications, setAcceptedApplications] =
    useState([]);

  const [selectedApplicationId, setSelectedApplicationId] =
    useState("");

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     CHARGER LES CONVENTIONS
  ========================================================= */

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/conventions");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setConventions(data);
    } catch (err) {
      console.error(
        "Erreur chargement conventions :",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Impossible de charger les conventions."
      );

      setConventions([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     ÉTUDIANT : CANDIDATURES ACCEPTÉES
  ========================================================= */

  const loadAcceptedApplications = async () => {
    if (user?.role !== "etudiant") {
      setAcceptedApplications([]);
      return;
    }

    try {
      const res = await api.get("/applications");

      const applications = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      const accepted = applications.filter(
        (app) => app.statut === "acceptee"
      );

      setAcceptedApplications(accepted);
    } catch (err) {
      console.error(
        "Erreur chargement candidatures acceptées :",
        err
      );

      setAcceptedApplications([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadAcceptedApplications();
  }, [user]);

  /* =========================================================
     ÉTUDIANT : UPLOAD
  ========================================================= */

  const handleUpload = async () => {
    if (!file || !selectedApplicationId) {
      setError(
        "Veuillez sélectionner une candidature et un fichier PDF."
      );

      return;
    }

    if (file.type !== "application/pdf") {
      setError(
        "Veuillez sélectionner un fichier PDF."
      );

      return;
    }

    const data = new FormData();

    data.append(
      "application_id",
      selectedApplicationId
    );

    data.append("fichier", file);

    setSubmitting(true);
    setError("");

    try {
      await api.post("/conventions", data);

      setSelectedApplicationId("");
      setFile(null);

      const fileInput =
        document.getElementById(
          "convention-file"
        );

      if (fileInput) {
        fileInput.value = "";
      }

      await load();
      await loadAcceptedApplications();
    } catch (err) {
      console.error(
        "Erreur upload convention :",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Impossible d'envoyer la convention."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     APPLICATIONS SANS CONVENTION
  ========================================================= */

  const applicationsWithoutConvention =
    useMemo(() => {
      return acceptedApplications.filter(
        (app) =>
          !conventions.some(
            (conv) =>
              conv.application_id === app.id
          )
      );
    }, [
      acceptedApplications,
      conventions,
    ]);

  /* =========================================================
     RECHERCHE
  ========================================================= */

  const filteredConventions = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return conventions;
    }

    return conventions.filter((conv) => {
      const text = `
        ${conv.application?.offer?.titre || ""}
        ${conv.application?.offer?.company?.nom || ""}
        ${conv.application?.student?.user?.name || ""}
        ${STATUT_LABELS[conv.statut] || ""}
      `.toLowerCase();

      return text.includes(value);
    });
  }, [conventions, search]);

  /* =========================================================
     STATISTIQUES
  ========================================================= */

  const stats = useMemo(() => {
    return {
      total: conventions.length,

      preparation: conventions.filter(
        (conv) =>
          conv.statut === "en_preparation"
      ).length,

      signee: conventions.filter(
        (conv) =>
          conv.statut === "signee"
      ).length,

      validee: conventions.filter(
        (conv) =>
          conv.statut === "validee_admin"
      ).length,

      rejetee: conventions.filter(
        (conv) =>
          conv.statut === "rejetee"
      ).length,
    };
  }, [conventions]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] flex items-center justify-center">
        <div className="text-center">

          <div className="w-8 h-8 mx-auto border-[3px] border-[#dcecef] border-t-[#08B7C9] rounded-full animate-spin" />

          <p className="mt-3 text-sm text-[#819399]">
            Loading...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8]">

      <div className="mx-auto max-w-[1150px] px-5 py-7 md:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-[27px] font-bold tracking-tight text-[#123F4B] md:text-[30px]">
                Conventions de stage
              </h1>

              <p className="mt-1.5 max-w-[650px] text-[13px] text-[#819399]">
                {user?.role === "etudiant"
                  ? "Déposez votre convention signée et suivez son état de validation."
                  : "Consultez les conventions liées aux stages de vos étudiants."}
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                load();

                if (user?.role === "etudiant") {
                  loadAcceptedApplications();
                }
              }}
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-[#e4edef]
                bg-white
                px-3.5
                py-2
                text-sm
                font-semibold
                text-[#526970]
                shadow-[0_3px_15px_rgba(18,63,75,0.045)]
                transition-all
                hover:border-[#c9e9ec]
                hover:bg-[#EAFBFC]
                hover:text-[#08B7C9]
              "
            >
              <Icon.refresh className="h-4 w-4" />

              Actualiser
            </button>

          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-[#EF4444]">
              <Icon.alert className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-sm font-semibold text-red-800">
                Une erreur est survenue
              </p>

              <p className="mt-0.5 text-sm text-red-600">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 hover:text-red-600"
            >
              <Icon.x className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-7 flex flex-wrap justify-center gap-4">

          <div
            className="
              w-full
              min-w-[190px]
              rounded-2xl
              border
              border-[#e4edef]
              bg-white
              px-5
              py-5
              text-center
              shadow-[0_3px_15px_rgba(18,63,75,0.045)]
              transition-all
              duration-300
              hover:-translate-y-[2px]
              hover:border-[#c9e9ec]
              hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
              sm:w-[220px]
              lg:flex-1
            "
          >

            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAFBFC] text-[#08B7C9]">
              <Icon.file className="h-5 w-5" />
            </div>

            <div className="text-[28px] font-bold text-[#123F4B]">
              {stats.total}
            </div>

            <div className="mt-2 text-[12px] text-[#819399]">
              Toutes les conventions
            </div>

          </div>

          <div
            className="
              w-full
              min-w-[190px]
              rounded-2xl
              border
              border-[#e4edef]
              bg-white
              px-5
              py-5
              text-center
              shadow-[0_3px_15px_rgba(18,63,75,0.045)]
              transition-all
              duration-300
              hover:-translate-y-[2px]
              hover:border-[#c9e9ec]
              hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
              sm:w-[220px]
              lg:flex-1
            "
          >

            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f6f7] text-[#526970]">
              <Icon.clock className="h-5 w-5" />
            </div>

            <div className="text-[28px] font-bold text-[#123F4B]">
              {stats.preparation}
            </div>

            <div className="mt-2 text-[12px] text-[#819399]">
              En préparation
            </div>

          </div>

          <div
            className="
              w-full
              min-w-[190px]
              rounded-2xl
              border
              border-[#e4edef]
              bg-white
              px-5
              py-5
              text-center
              shadow-[0_3px_15px_rgba(18,63,75,0.045)]
              transition-all
              duration-300
              hover:-translate-y-[2px]
              hover:border-[#c9e9ec]
              hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
              sm:w-[220px]
              lg:flex-1
            "
          >

            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecfdf3] text-[#22C55E]">
              <Icon.check className="h-5 w-5" />
            </div>

            <div className="text-[28px] font-bold text-[#123F4B]">
              {stats.validee}
            </div>

            <div className="mt-2 text-[12px] text-[#819399]">
              Validées
            </div>

          </div>

          <div
            className="
              w-full
              min-w-[190px]
              rounded-2xl
              border
              border-[#e4edef]
              bg-white
              px-5
              py-5
              text-center
              shadow-[0_3px_15px_rgba(18,63,75,0.045)]
              transition-all
              duration-300
              hover:-translate-y-[2px]
              hover:border-[#c9e9ec]
              hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
              sm:w-[220px]
              lg:flex-1
            "
          >

            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f2] text-[#EF4444]">
              <Icon.alert className="h-5 w-5" />
            </div>

            <div className="text-[28px] font-bold text-[#123F4B]">
              {stats.rejetee}
            </div>

            <div className="mt-2 text-[12px] text-[#819399]">
              Rejetées
            </div>

          </div>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="
            mb-5
            rounded-2xl
            border
            border-[#e4edef]
            bg-white
            p-4
            shadow-[0_3px_15px_rgba(18,63,75,0.045)]
          "
        >

          <div className="relative max-w-xl">

            <Icon.search
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                h-4
                w-4
                -translate-y-1/2
                text-[#94A4A9]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder={
                user?.role === "etudiant"
                  ? "Rechercher une convention..."
                  : "Rechercher un stagiaire, une convention..."
              }
              className="
                w-full
                rounded-xl
                border
                border-[#e4edef]
                bg-[#f5f7f8]
                py-2.5
                pl-9
                pr-4
                text-sm
                text-[#123F4B]
                outline-none
                transition-all
                placeholder:text-[#94A4A9]
                focus:border-[#08B7C9]
                focus:bg-white
                focus:ring-4
                focus:ring-[#EAFBFC]
              "
            />

          </div>

        </div>

        {/* =================================================
            CONVENTIONS
        ================================================= */}

        <div className="mb-8">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-[#123F4B]">
                {user?.role === "etudiant"
                  ? "Mes conventions"
                  : "Conventions de mes stagiaires"}
              </h2>

              <p className="mt-0.5 text-sm text-[#819399]">
                {filteredConventions.length} convention
                {filteredConventions.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

          {filteredConventions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#dce7e9] bg-white px-6 py-16 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAFBFC] text-[#08B7C9]">
                <Icon.file className="h-6 w-6" />
              </div>

              <h3 className="font-semibold text-[#123F4B]">
                Aucune convention trouvée
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-[#94A4A9]">
                {search
                  ? "Essayez avec un autre terme de recherche."
                  : user?.role === "etudiant"
                    ? "Vos conventions apparaîtront ici."
                    : "Les conventions de vos stagiaires apparaîtront ici."}
              </p>

            </div>
          ) : (
            <div className="grid gap-4">

              {filteredConventions.map((conv) => (
                <ConventionCard
                  key={conv.id}
                  conv={conv}
                  role={user?.role}
                />
              ))}

            </div>
          )}

        </div>

        {/* =================================================
            ÉTUDIANT : UPLOAD
        ================================================= */}

        {user?.role === "etudiant" && (
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[#c9e9ec]
              bg-white
              shadow-[0_3px_15px_rgba(18,63,75,0.045)]
            "
          >

            <div
              className="
                border-b
                border-[#dcecef]
                bg-gradient-to-r
                from-[#EAFBFC]
                to-white
                px-5
                py-5
                sm:px-6
              "
            >

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#08B7C9] text-white shadow-sm shadow-[#b9e7eb]">
                  <Icon.upload className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="font-bold text-[#123F4B]">
                    Déposer une convention signée
                  </h2>

                  <p className="mt-1 text-sm text-[#819399]">
                    Sélectionnez votre candidature acceptée
                    et importez la convention au format PDF.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              {applicationsWithoutConvention.length === 0 ? (

                <div className="flex items-start gap-3 rounded-xl border border-[#e4edef] bg-[#f5f7f8] p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#08B7C9] shadow-sm">
                    <Icon.check className="h-4 w-4" />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#526970]">
                      Rien à déposer pour le moment
                    </p>

                    <p className="mt-0.5 text-sm text-[#819399]">
                      Aucune candidature acceptée n'attend
                      actuellement de convention.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="space-y-5">

                  {/* Candidature */}

                  <div>

                    <label
                      htmlFor="application"
                      className="mb-2 block text-sm font-semibold text-[#526970]"
                    >
                      Candidature concernée
                    </label>

                    <select
                      id="application"
                      value={selectedApplicationId}
                      onChange={(e) =>
                        setSelectedApplicationId(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#e4edef]
                        bg-white
                        px-3.5
                        py-3
                        text-sm
                        text-[#526970]
                        outline-none
                        transition-all
                        focus:border-[#08B7C9]
                        focus:ring-4
                        focus:ring-[#EAFBFC]
                      "
                    >

                      <option value="">
                        Sélectionner une candidature
                      </option>

                      {applicationsWithoutConvention.map(
                        (app) => (
                          <option
                            key={app.id}
                            value={app.id}
                          >
                            {app.offer?.titre ||
                              "Offre sans titre"}{" "}
                            —{" "}
                            {app.offer?.company?.nom ||
                              "Entreprise"}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* Fichier */}

                  <div>

                    <label
                      htmlFor="convention-file"
                      className="mb-2 block text-sm font-semibold text-[#526970]"
                    >
                      Convention signée
                    </label>

                    <label
                      htmlFor="convention-file"
                      className={`
                        flex
                        cursor-pointer
                        flex-col
                        items-center
                        justify-center
                        rounded-xl
                        border-2
                        border-dashed
                        px-6
                        py-8
                        text-center
                        transition-all
                        ${
                          file
                            ? "border-[#08B7C9] bg-[#EAFBFC]"
                            : "border-[#dce7e9] bg-[#f5f7f8] hover:border-[#08B7C9] hover:bg-[#EAFBFC]"
                        }
                      `}
                    >

                      <div
                        className={`
                          mb-3
                          flex
                          h-12
                          w-12
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            file
                              ? "bg-[#EAFBFC] text-[#08B7C9]"
                              : "bg-white text-[#94A4A9] shadow-sm"
                          }
                        `}
                      >
                        <Icon.file className="h-6 w-6" />
                      </div>

                      {file ? (
                        <>
                          <p className="text-sm font-semibold text-[#123F4B]">
                            {file.name}
                          </p>

                          <p className="mt-1 text-xs text-[#94A4A9]">
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                          <p className="mt-2 text-xs font-medium text-[#08B7C9]">
                            Cliquer pour remplacer le
                            fichier
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-[#526970]">
                            Cliquez pour sélectionner
                            votre PDF
                          </p>

                          <p className="mt-1 text-xs text-[#94A4A9]">
                            Format accepté : PDF
                          </p>
                        </>
                      )}

                    </label>

                    <input
                      id="convention-file"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setFile(
                          e.target.files?.[0] ||
                            null
                        )
                      }
                      className="hidden"
                    />

                  </div>

                  {/* Boutons */}

                  <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedApplicationId("");
                        setFile(null);

                        const input =
                          document.getElementById(
                            "convention-file"
                          );

                        if (input) {
                          input.value = "";
                        }
                      }}
                      disabled={
                        !file &&
                        !selectedApplicationId
                      }
                      className="
                        rounded-xl
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-[#819399]
                        transition-colors
                        hover:bg-[#f5f7f8]
                        hover:text-[#526970]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                    >
                      Réinitialiser
                    </button>

                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={
                        !file ||
                        !selectedApplicationId ||
                        submitting
                      }
                      className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[#08B7C9]
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        shadow-[#b9e7eb]
                        transition-all
                        hover:bg-[#079dad]
                        hover:shadow-md
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      {submitting ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Icon.upload className="h-4 w-4" />

                          Envoyer la convention
                        </>
                      )}

                    </button>

                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* =================================================
            ENTREPRISE
        ================================================= */}

        {user?.role === "entreprise" && (
          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-[#c9e9ec]
              bg-white
              shadow-[0_3px_15px_rgba(18,63,75,0.045)]
            "
          >

            <div
              className="
                bg-gradient-to-r
                from-[#EAFBFC]
                to-white
                px-5
                py-5
                sm:px-6
              "
            >

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#08B7C9] text-white shadow-sm shadow-[#b9e7eb]">
                  <Icon.building className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="font-bold text-[#123F4B]">
                    Suivi des conventions
                  </h2>

                  <p className="mt-1 text-sm text-[#819399]">
                    Consultez les conventions associées aux
                    étudiants sélectionnés pour vos offres de
                    stage.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              <div className="rounded-xl border border-[#e4edef] bg-[#f5f7f8] p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#08B7C9] shadow-sm">
                    <Icon.file className="h-4 w-4" />
                  </div>

                  <div>

                    <p className="text-sm font-semibold text-[#526970]">
                      Gestion des conventions
                    </p>

                    <p className="mt-1 text-sm text-[#819399]">
                      Vous pouvez consulter les conventions
                      déposées par les étudiants et suivre leur
                      état d'avancement.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}