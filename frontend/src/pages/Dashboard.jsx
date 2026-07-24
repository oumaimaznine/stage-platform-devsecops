import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../api/axios";

const COLORS = ["#6d5ef8", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

const tooltipStyle = {
  contentStyle: {
    backgroundColor: "#ffffff",
    border: "1px solid #e4e4e7",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  labelStyle: { color: "#18181b" },
  itemStyle: { color: "#18181b" },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setStats(res.data));
    api.get("/dashboard/charts").then((res) => setCharts(res.data));
  }, []);

  if (!stats || !charts) return <p className="p-6 text-ink-500">Chargement...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-xl font-bold text-ink-100">Consultez les statistiques, les informations importantes et les actions récentes depuis votre espace de gestion.</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white border border-ink-800 hover:border-ink-700 rounded-xl p-4 text-center shadow-card transition-colors"
          >
            <p className="text-2xl font-bold text-ink-100">{value}</p>
            <p className="text-sm text-ink-500 capitalize">{key.replaceAll("_", " ")}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {charts.candidatures_par_statut && (
          <div className="bg-white border border-ink-800 rounded-xl p-4 shadow-card">
            <h2 className="font-semibold mb-2 text-ink-100">Candidatures par statut</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={charts.candidatures_par_statut}
                  dataKey="total"
                  nameKey="statut"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={{ fill: "#3f3f46" }}
                >
                  {charts.candidatures_par_statut.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: "#71717a" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {charts.offres_par_statut && (
          <div className="bg-white border border-ink-800 rounded-xl p-4 shadow-card">
            <h2 className="font-semibold mb-2 text-ink-100">Offres par statut</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={charts.offres_par_statut}
                  dataKey="total"
                  nameKey="statut"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={{ fill: "#3f3f46" }}
                >
                  {charts.offres_par_statut.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: "#71717a" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {charts.candidatures_par_mois && (
          <div className="md:col-span-2 bg-white border border-ink-800 rounded-xl p-4 shadow-card">
            <h2 className="font-semibold mb-2 text-ink-100">Évolution des candidatures</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts.candidatures_par_mois}>
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="3 3" />
                <XAxis dataKey="mois" stroke="#a1a1aa" tick={{ fill: "#71717a" }} />
                <YAxis allowDecimals={false} stroke="#a1a1aa" tick={{ fill: "#71717a" }} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                <Bar dataKey="total" fill="#6d5ef8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
