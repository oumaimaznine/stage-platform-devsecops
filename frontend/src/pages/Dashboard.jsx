import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "../api/axios";

/* =========================================================
   COLORS
========================================================= */

const COLORS = [
  "#08B7C9",
  "#123F4B",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

/* =========================================================
   TOOLTIP
========================================================= */

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5edef",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(18,63,75,0.10)",
    padding: "10px 14px",
  },

  labelStyle: {
    color: "#123F4B",
    fontWeight: "600",
    fontSize: "12px",
  },

  itemStyle: {
    color: "#526970",
    fontSize: "12px",
  },
};

/* =========================================================
   STAT ICONS
========================================================= */

function StatIcon({ type }) {
  if (type === "applications") {
    return (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path d="M14 2v6h6" />

        <path
          d="M8 13h8M8 17h5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "accepted") {
    return (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />

        <path
          d="m8 12 2.5 2.5L16 9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "offers") {
    return (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect
          x="3"
          y="7"
          width="18"
          height="13"
          rx="2"
        />

        <path
          d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path d="M3 12h18" />
      </svg>
    );
  }

  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="9" cy="7" r="4" />

      <path
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* =========================================================
   DETECT STAT TYPE
========================================================= */

function getStatType(key) {
  const value = key.toLowerCase();

  if (
    value.includes("accept") ||
    value.includes("accepted")
  ) {
    return "accepted";
  }

  if (
    value.includes("candidature") ||
    value.includes("application")
  ) {
    return "applications";
  }

  if (
    value.includes("offre") ||
    value.includes("stage")
  ) {
    return "offers";
  }

  return "users";
}

/* =========================================================
   FORMAT LABEL
========================================================= */

function formatLabel(key) {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);

  /* =======================================================
     API
  ======================================================= */

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error(
          "Dashboard error:",
          err
        );
      });

    api
      .get("/dashboard/charts")
      .then((res) => {
        setCharts(res.data);
      })
      .catch((err) => {
        console.error(
          "Dashboard charts error:",
          err
        );
      });
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (!stats || !charts) {
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

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] px-5 md:px-8 py-7">
      <div className="max-w-[1150px] mx-auto">

        {/* =================================================
            HEADER DASHBOARD
        ================================================= */}

        <div className="mb-7">
          <h1 className="text-[27px] md:text-[30px] font-bold text-[#123F4B]">
            Dashboard
          </h1>

          <p className="mt-1.5 text-[13px] text-[#819399] max-w-[650px]">
            Consultez les statistiques, les informations importantes
            et les activités récentes depuis votre espace de gestion.
          </p>
        </div>

        {/* =================================================
            RECOMMANDATIONS IA
        ================================================= */}

        <div
          className="
            mb-7
            rounded-2xl
            border
            border-[#d8f1f3]
            bg-[#EAFBFC]
            p-5
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >
          {/* LEFT */}

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-white
                  text-[#08B7C9]
                "
              >
                ✨
              </span>

              <h2 className="text-sm font-bold text-[#123F4B]">
                Recommandations IA
              </h2>
            </div>

            <p className="mt-2 max-w-[650px] text-xs leading-5 text-[#526970]">
              Découvrez les offres de stage les plus adaptées
              à votre profil, vos compétences et vos préférences.
            </p>
          </div>

          {/* BUTTON */}

          <button
            type="button"
            onClick={() =>
              navigate("/recommendations")
            }
            className="
              shrink-0
              rounded-xl
              bg-[#08B7C9]
              px-5
              py-2.5
              text-xs
              font-bold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#079eae]
              hover:shadow-md
            "
          >
            Voir mes recommandations
          </button>
        </div>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <div
          className="
            flex
            flex-wrap
            justify-center
            gap-4
            mb-7
          "
        >
          {Object.entries(stats).map(
            ([key, value]) => {
              const type =
                getStatType(key);

              return (
                <div
                  key={key}
                  className="
                    w-full
                    sm:w-[220px]
                    lg:flex-1

                    min-w-[190px]

                    bg-white

                    border
                    border-[#e4edef]

                    rounded-2xl

                    px-5
                    py-5

                    text-center

                    shadow-[0_3px_15px_rgba(18,63,75,0.045)]

                    hover:-translate-y-[2px]
                    hover:border-[#c9e9ec]
                    hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]

                    transition-all
                    duration-300
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      mx-auto
                      w-10
                      h-10
                      rounded-xl
                      bg-[#EAFBFC]
                      text-[#08B7C9]
                      flex
                      items-center
                      justify-center
                      mb-4
                    "
                  >
                    <StatIcon type={type} />
                  </div>

                  {/* NUMBER */}

                  <div className="text-[28px] font-bold text-[#123F4B]">
                    {value}
                  </div>

                  {/* TITLE */}

                  <div className="mt-2 text-[12px] text-[#819399]">
                    {formatLabel(key)}
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* =================================================
            CHARTS
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* =================================================
              CANDIDATURES PAR STATUT
          ================================================= */}

          {charts.candidatures_par_statut && (
            <div
              className="
                bg-white
                border
                border-[#e4edef]
                rounded-2xl
                p-5

                shadow-[0_3px_15px_rgba(18,63,75,0.045)]

                hover:shadow-[0_8px_25px_rgba(18,63,75,0.07)]

                transition-all
                duration-300
              "
            >
              <div className="text-center">
                <h2 className="text-[15px] font-semibold text-[#123F4B]">
                  Candidatures par statut
                </h2>

                <p className="text-[11px] text-[#94A4A9] mt-1">
                  Répartition de vos candidatures
                </p>
              </div>

              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <PieChart>
                  <Pie
                    data={
                      charts.candidatures_par_statut
                    }
                    dataKey="total"
                    nameKey="statut"
                    cx="50%"
                    cy="47%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {charts.candidatures_par_statut.map(
                      (_, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    {...tooltipStyle}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={35}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* =================================================
              OFFRES PAR STATUT
          ================================================= */}

          {charts.offres_par_statut && (
            <div
              className="
                bg-white
                border
                border-[#e4edef]
                rounded-2xl
                p-5

                shadow-[0_3px_15px_rgba(18,63,75,0.045)]

                hover:shadow-[0_8px_25px_rgba(18,63,75,0.07)]

                transition-all
                duration-300
              "
            >
              <div className="text-center">
                <h2 className="text-[15px] font-semibold text-[#123F4B]">
                  Offres par statut
                </h2>

                <p className="text-[11px] text-[#94A4A9] mt-1">
                  Répartition des offres disponibles
                </p>
              </div>

              <ResponsiveContainer
                width="100%"
                height={280}
              >
                <PieChart>
                  <Pie
                    data={
                      charts.offres_par_statut
                    }
                    dataKey="total"
                    nameKey="statut"
                    cx="50%"
                    cy="47%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={3}
                  >
                    {charts.offres_par_statut.map(
                      (_, index) => (
                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />
                      )
                    )}
                  </Pie>

                  <Tooltip
                    {...tooltipStyle}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={35}
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* =================================================
            MONTHLY APPLICATIONS
        ================================================= */}

        {charts.candidatures_par_mois && (
          <div
            className="
              mt-5

              bg-white

              border
              border-[#e4edef]

              rounded-2xl

              p-5

              shadow-[0_3px_15px_rgba(18,63,75,0.045)]

              hover:shadow-[0_8px_25px_rgba(18,63,75,0.07)]

              transition-all
              duration-300
            "
          >
            <div className="text-center mb-4">
              <h2 className="text-[15px] font-semibold text-[#123F4B]">
                Évolution des candidatures
              </h2>

              <p className="text-[11px] text-[#94A4A9] mt-1">
                Activité des candidatures au fil des mois
              </p>
            </div>

            <ResponsiveContainer
              width="100%"
              height={290}
            >
              <BarChart
                data={
                  charts.candidatures_par_mois
                }
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="#edf2f3"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="mois"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#819399",
                    fontSize: 11,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#819399",
                    fontSize: 11,
                  }}
                />

                <Tooltip
                  {...tooltipStyle}
                  cursor={{
                    fill: "rgba(8,183,201,0.04)",
                  }}
                />

                <Bar
                  dataKey="total"
                  fill="#08B7C9"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}