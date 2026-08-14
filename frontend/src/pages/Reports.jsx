import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

/* =========================================================
   STATUTS
========================================================= */

const STATUT_LABELS = {
  depose: "Déposé",
  valide: "Validé",
  rejete: "Rejeté",
};

const STATUT_COLORS = {
  depose:
    "bg-[#FFF8E8] text-[#C98A00] ring-1 ring-inset ring-[#F5D98A]",

  valide:
    "bg-[#ECFDF3] text-[#16803C] ring-1 ring-inset ring-[#B7E7C8]",

  rejete:
    "bg-[#FEF2F2] text-[#DC2626] ring-1 ring-inset ring-[#FECACA]",
};

const STATUT_BAR = {
  depose: "bg-[#F59E0B]",
  valide: "bg-[#22C55E]",
  rejete: "bg-[#EF4444]",
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
      <path d="M8 13h8M8 17h6" strokeLinecap="round" />
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
      <path d="M12 7v5l3 2" strokeLinecap="round" />
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
      <path d="m3 9 9-5 9 5-9 5-9-5Z" strokeLinejoin="round" />
      <path
        d="M7 12v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4"
        strokeLinecap="round"
      />
      <path d="M21 10v5" strokeLinecap="round" />
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
      <path d="m20 20-4-4" strokeLinecap="round" />
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
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
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
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
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
      <path d="M3 5v5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M21 19v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
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
        flex-1
        min-w-[190px]
        bg-white
        border
        border-[#e4edef]
        rounded-2xl
        px-5
        py-5
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
        hover:-translate-y-[2px]
        hover:border-[#c9e9ec]
        hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
        transition-all
        duration-300
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-[#819399]">
            {label}
          </p>

          <p className="mt-2 text-[28px] font-bold tracking-tight text-[#123F4B]">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-[#94A4A9]">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   REPORT CARD
========================================================= */

function ReportCard({ report }) {
  const statusLabel =
    STATUT_LABELS[report.statut] || "Statut inconnu";

  const statusColor =
    STATUT_COLORS[report.statut] ||
    "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-200";

  const statusBar =
    STATUT_BAR[report.statut] || "bg-gray-400";

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[#e4edef]
        bg-white
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-[#c9e9ec]
        hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
      "
    >
      {/* Barre statut */}

      <div
        className={`absolute inset-y-0 left-0 w-1 ${statusBar}`}
      />

      <div className="p-5 sm:p-6">

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div className="flex min-w-0 items-start gap-4">

            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[#EAFBFC]
                text-[#08B7C9]
              "
            >
              <Icon.file className="h-5 w-5" />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-[15px] font-semibold text-[#123F4B]">
                {report.titre || "Rapport de stage"}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-[#819399]">

                {report.convention?.application?.offer?.company
                  ?.nom && (
                  <span className="inline-flex items-center gap-1">
                    <Icon.building className="h-3.5 w-3.5" />

                    {
                      report.convention.application.offer
                        .company.nom
                    }
                  </span>
                )}

                {report.convention?.application?.student?.user
                  ?.name && (
                  <>
                    <span className="text-[#D5E1E4]">
                      •
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <Icon.graduation className="h-3.5 w-3.5" />

                      {
                        report.convention.application.student
                          .user.name
                      }
                    </span>
                  </>
                )}

              </div>
            </div>
          </div>

          <span
            className={`
              inline-flex
              w-fit
              shrink-0
              items-center
              rounded-full
              px-3
              py-1.5
              text-[11px]
              font-semibold
              ${statusColor}
            `}
          >
            {statusLabel}
          </span>

        </div>

        {/* CONVENTION */}

        {report.convention?.application?.offer?.titre && (
          <div
            className="
              mt-5
              rounded-xl
              border
              border-[#e4edef]
              bg-[#f8fafb]
              p-4
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A4A9]">
              Convention associée
            </p>

            <p className="mt-1 text-[13px] font-semibold text-[#526970]">
              {report.convention.application.offer.titre}
            </p>
          </div>
        )}

        {/* COMMENTAIRE */}

        {report.commentaire ? (
          <div className="mt-4">

            <div className="flex items-start gap-3">

              <div
                className="
                  mt-0.5
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                "
              >
                <Icon.file className="h-4 w-4" />
              </div>

              <div className="min-w-0">

                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#94A4A9]">
                  Commentaire
                </p>

                <p className="mt-1 text-[13px] leading-6 text-[#526970]">
                  {report.commentaire}
                </p>

              </div>

            </div>

          </div>
        ) : (
          <p className="mt-4 text-[11px] text-[#94A4A9]">
            Aucun commentaire pour le moment.
          </p>
        )}

        {/* FOOTER */}

        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            border-t
            border-[#edf2f3]
            pt-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-2 text-[11px] text-[#94A4A9]">
            <Icon.file className="h-4 w-4" />
            Document PDF
          </div>

          {report.fichier_path && (
            <a
              href={`http://localhost:8000/storage/${report.fichier_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#e4edef]
                bg-white
                px-3.5
                py-2
                text-[12px]
                font-semibold
                text-[#526970]
                shadow-sm
                transition-all
                hover:border-[#c9e9ec]
                hover:bg-[#EAFBFC]
                hover:text-[#08B7C9]
              "
            >
              <Icon.eye className="h-4 w-4" />
              Voir le rapport
            </a>
          )}

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   REPORTS
========================================================= */

export default function Reports() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myConventions, setMyConventions] = useState([]);
  const [conventionId, setConventionId] = useState("");
  const [titre, setTitre] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  /* =========================================================
     LOAD REPORTS
  ========================================================= */

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/reports");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setReports(data);
    } catch (err) {
      console.error(
        "Erreur chargement rapports :",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Impossible de charger les rapports."
      );

      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     LOAD CONVENTIONS
  ========================================================= */

  const loadMyConventions = async () => {
    if (user?.role !== "etudiant") {
      setMyConventions([]);
      return;
    }

    try {
      const res = await api.get("/conventions");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setMyConventions(data);
    } catch (err) {
      console.error(
        "Erreur chargement conventions :",
        err
      );
    }
  };

  /* =========================================================
     EFFECTS
  ========================================================= */

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadMyConventions();
  }, [user]);

  /* =========================================================
     UPLOAD
  ========================================================= */

  const handleUpload = async () => {
    if (!file || !titre.trim() || !conventionId) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError(
        "Veuillez sélectionner un fichier PDF."
      );
      return;
    }

    const data = new FormData();

    data.append("convention_id", conventionId);
    data.append("titre", titre.trim());
    data.append("fichier", file);

    setSubmitting(true);
    setError("");

    try {
      await api.post("/reports", data);

      setTitre("");
      setConventionId("");
      setFile(null);

      const fileInput =
        document.getElementById("report-file");

      if (fileInput) {
        fileInput.value = "";
      }

      await load();
      await loadMyConventions();
    } catch (err) {
      console.error(
        "Erreur upload rapport :",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Impossible d'envoyer le rapport."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     CONVENTIONS WITHOUT REPORT
  ========================================================= */

  const conventionsWithoutReport = useMemo(() => {
    return myConventions.filter(
      (convention) =>
        !reports.some(
          (report) =>
            report.convention_id === convention.id
        )
    );
  }, [myConventions, reports]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredReports = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return reports;
    }

    return reports.filter((report) => {
      const text = `
        ${report.titre || ""}
        ${report.statut || ""}
        ${STATUT_LABELS[report.statut] || ""}
        ${
          report.convention?.application?.offer?.titre ||
          ""
        }
        ${
          report.convention?.application?.offer?.company
            ?.nom || ""
        }
        ${
          report.convention?.application?.student?.user
            ?.name || ""
        }
      `.toLowerCase();

      return text.includes(value);
    });
  }, [reports, search]);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    return {
      total: reports.length,

      depose: reports.filter(
        (report) => report.statut === "depose"
      ).length,

      valide: reports.filter(
        (report) => report.statut === "valide"
      ).length,

      rejete: reports.filter(
        (report) => report.statut === "rejete"
      ).length,
    };
  }, [reports]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] flex items-center justify-center">
        <div className="text-center">

          <div
            className="
              w-8
              h-8
              mx-auto
              border-[3px]
              border-[#dcecef]
              border-t-[#08B7C9]
              rounded-full
              animate-spin
            "
          />

          <p className="mt-3 text-sm text-[#819399]">
            Chargement...
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] px-5 md:px-8 py-7">

      <div className="max-w-[1150px] mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <h1 className="text-[27px] md:text-[30px] font-bold text-[#123F4B]">
                Rapports de stage
              </h1>

              <p className="mt-1.5 text-[13px] text-[#819399] max-w-[650px]">
                Déposez, consultez et suivez vos rapports de
                stage tout au long de votre parcours.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                load();
                loadMyConventions();
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
                text-[12px]
                font-semibold
                text-[#526970]
                shadow-sm
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
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEE2E2] text-[#DC2626]">
              <Icon.alert className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">

              <p className="text-[12px] font-semibold text-[#991B1B]">
                Une erreur est survenue
              </p>

              <p className="mt-0.5 text-[12px] text-[#DC2626]">
                {error}
              </p>

            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-[#F87171] hover:text-[#DC2626]"
            >
              <Icon.x className="h-4 w-4" />
            </button>

          </div>
        )}

        {/* =================================================
            STATISTIQUES
        ================================================= */}

        <div className="flex flex-wrap justify-center gap-4 mb-7">

          <StatCard
            icon={<Icon.file className="h-5 w-5" />}
            iconClass="bg-[#EAFBFC] text-[#08B7C9]"
            label="Total"
            value={stats.total}
            description="Tous les rapports"
          />

          <StatCard
            icon={<Icon.clock className="h-5 w-5" />}
            iconClass="bg-[#FFF8E8] text-[#F59E0B]"
            label="Déposés"
            value={stats.depose}
            description="En attente de validation"
          />

          <StatCard
            icon={<Icon.check className="h-5 w-5" />}
            iconClass="bg-[#ECFDF3] text-[#22C55E]"
            label="Validés"
            value={stats.valide}
            description="Rapports validés"
          />

          <StatCard
            icon={<Icon.alert className="h-5 w-5" />}
            iconClass="bg-[#FEF2F2] text-[#EF4444]"
            label="Rejetés"
            value={stats.rejete}
            description="Nécessitent une correction"
          />

        </div>

        {/* =================================================
            RECHERCHE
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

            <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A4A9]" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Rechercher un rapport, une entreprise..."
              className="
                w-full
                rounded-xl
                border
                border-[#e4edef]
                bg-[#f8fafb]
                py-2.5
                pl-9
                pr-4
                text-[12px]
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
            LISTE RAPPORTS
        ================================================= */}

        <div className="mb-8">

          <div className="mb-4 flex items-center justify-between">

            <div>

              <h2 className="text-[15px] font-semibold text-[#123F4B]">
                Vos rapports
              </h2>

              <p className="mt-1 text-[11px] text-[#94A4A9]">
                {filteredReports.length} rapport
                {filteredReports.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

          {filteredReports.length === 0 ? (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-[#dcecef]
                bg-white
                px-6
                py-16
                text-center
                shadow-[0_3px_15px_rgba(18,63,75,0.035)]
              "
            >

              <div
                className="
                  mx-auto
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                "
              >
                <Icon.file className="h-6 w-6" />
              </div>

              <h3 className="text-[14px] font-semibold text-[#123F4B]">
                Aucun rapport trouvé
              </h3>

              <p className="mx-auto mt-1 max-w-md text-[12px] text-[#94A4A9]">
                {search
                  ? "Essayez avec un autre terme de recherche."
                  : "Vos rapports de stage apparaîtront ici après leur dépôt."}
              </p>

            </div>
          ) : (
            <div className="grid gap-4">

              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                />
              ))}

            </div>
          )}

        </div>

        {/* =================================================
            DEPOT
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

            {/* HEADER DEPOT */}

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

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#08B7C9]
                    text-white
                    shadow-sm
                  "
                >
                  <Icon.upload className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-[15px] font-semibold text-[#123F4B]">
                    Déposer un rapport
                  </h2>

                  <p className="mt-1 text-[12px] text-[#819399]">
                    Sélectionnez une convention et importez
                    votre rapport au format PDF.
                  </p>

                </div>

              </div>

            </div>

            <div className="p-5 sm:p-6">

              {conventionsWithoutReport.length === 0 ? (

                <div className="flex items-start gap-3 rounded-xl border border-[#e4edef] bg-[#f8fafb] p-4">

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-white
                      text-[#08B7C9]
                      shadow-sm
                    "
                  >
                    <Icon.check className="h-4 w-4" />
                  </div>

                  <div>

                    <p className="text-[12px] font-semibold text-[#526970]">
                      Aucun dépôt disponible
                    </p>

                    <p className="mt-0.5 text-[12px] text-[#94A4A9]">
                      Aucune convention n'est actuellement
                      disponible pour un nouveau rapport.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="space-y-5">

                  {/* CONVENTION */}

                  <div>

                    <label
                      htmlFor="convention"
                      className="mb-2 block text-[12px] font-semibold text-[#526970]"
                    >
                      Convention associée
                    </label>

                    <select
                      id="convention"
                      value={conventionId}
                      onChange={(e) =>
                        setConventionId(e.target.value)
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#e4edef]
                        bg-white
                        px-3.5
                        py-3
                        text-[12px]
                        text-[#526970]
                        outline-none
                        transition-all
                        focus:border-[#08B7C9]
                        focus:ring-4
                        focus:ring-[#EAFBFC]
                      "
                    >

                      <option value="">
                        Sélectionner une convention
                      </option>

                      {conventionsWithoutReport.map(
                        (convention) => (
                          <option
                            key={convention.id}
                            value={convention.id}
                          >
                            {convention.application?.offer
                              ?.titre || "Stage"}{" "}
                            —{" "}
                            {convention.application?.offer
                              ?.company?.nom ||
                              "Entreprise"}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {/* TITRE */}

                  <div>

                    <label
                      htmlFor="report-title"
                      className="mb-2 block text-[12px] font-semibold text-[#526970]"
                    >
                      Titre du rapport
                    </label>

                    <input
                      id="report-title"
                      type="text"
                      placeholder="Ex. Rapport de stage — Développement Web"
                      value={titre}
                      onChange={(e) =>
                        setTitre(e.target.value)
                      }
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[#e4edef]
                        bg-white
                        px-3.5
                        py-3
                        text-[12px]
                        text-[#123F4B]
                        outline-none
                        transition-all
                        placeholder:text-[#94A4A9]
                        focus:border-[#08B7C9]
                        focus:ring-4
                        focus:ring-[#EAFBFC]
                      "
                    />

                  </div>

                  {/* FICHIER */}

                  <div>

                    <label
                      htmlFor="report-file"
                      className="mb-2 block text-[12px] font-semibold text-[#526970]"
                    >
                      Rapport PDF
                    </label>

                    <label
                      htmlFor="report-file"
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
                            : "border-[#dcecef] bg-[#f8fafb] hover:border-[#08B7C9] hover:bg-[#EAFBFC]"
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
                              ? "bg-white text-[#08B7C9] shadow-sm"
                              : "bg-white text-[#94A4A9] shadow-sm"
                          }
                        `}
                      >
                        <Icon.file className="h-6 w-6" />
                      </div>

                      {file ? (
                        <>
                          <p className="max-w-full truncate text-[12px] font-semibold text-[#123F4B]">
                            {file.name}
                          </p>

                          <p className="mt-1 text-[11px] text-[#94A4A9]">
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                          <p className="mt-2 text-[11px] font-medium text-[#08B7C9]">
                            Cliquer pour remplacer le fichier
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-[12px] font-semibold text-[#526970]">
                            Cliquez pour sélectionner votre
                            rapport
                          </p>

                          <p className="mt-1 text-[11px] text-[#94A4A9]">
                            Format accepté : PDF
                          </p>
                        </>
                      )}

                    </label>

                    <input
                      id="report-file"
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setFile(
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                    />

                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">

                    <button
                      type="button"
                      onClick={() => {
                        setTitre("");
                        setConventionId("");
                        setFile(null);

                        const input =
                          document.getElementById(
                            "report-file"
                          );

                        if (input) {
                          input.value = "";
                        }
                      }}
                      disabled={
                        !file &&
                        !titre &&
                        !conventionId
                      }
                      className="
                        rounded-xl
                        px-4
                        py-2.5
                        text-[12px]
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
                        !titre.trim() ||
                        !conventionId ||
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
                        text-[12px]
                        font-semibold
                        text-white
                        shadow-[0_4px_12px_rgba(8,183,201,0.20)]
                        transition-all
                        hover:bg-[#079EAE]
                        hover:shadow-[0_8px_20px_rgba(8,183,201,0.22)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >

                      {submitting ? (
                        <>
                          <span
                            className="
                              h-4
                              w-4
                              animate-spin
                              rounded-full
                              border-2
                              border-white/30
                              border-t-white
                            "
                          />

                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Icon.upload className="h-4 w-4" />
                          Envoyer le rapport
                        </>
                      )}

                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}