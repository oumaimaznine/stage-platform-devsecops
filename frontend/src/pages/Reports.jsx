import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUT_LABELS = { depose: "Déposé", valide: "Validé", rejete: "Rejeté" };
const STATUT_COLORS = {
  depose: "bg-amber-500/15 text-amber-600",
  valide: "bg-green-500/15 text-green-600",
  rejete: "bg-red-500/15 text-red-600",
};

export default function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myConventions, setMyConventions] = useState([]);
  const [conventionId, setConventionId] = useState("");
  const [titre, setTitre] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/reports")
      .then((res) => setReports(res.data))
      .finally(() => setLoading(false));
  };

  const loadMyConventions = () => {
    if (user?.role !== "etudiant") return;
    api.get("/conventions").then((res) => setMyConventions(res.data));
  };

  useEffect(load, []);
  useEffect(loadMyConventions, [user]);

  const handleUpload = async () => {
    if (!file || !titre || !conventionId) return;

    const data = new FormData();
    data.append("convention_id", conventionId);
    data.append("titre", titre);
    data.append("fichier", file);

    setSubmitting(true);
    try {
      await api.post("/reports", data);
      setTitre("");
      setConventionId("");
      setFile(null);
      load();
    } catch (err) {
      console.error("Erreur upload rapport :", err.response && err.response.data);
      alert(
        (err.response && err.response.data && err.response.data.message) ||
          "Impossible d'envoyer le rapport."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;

  const fileUrlPrefix = "http://localhost:8000/storage/";

  // Conventions déjà associées à un rapport -> on les exclut du menu
  const conventionsWithoutReport = myConventions.filter(
    (c) => !reports.some((r) => r.convention_id === c.id)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-gray-900">
        Déposez, consultez et suivez vos rapports de stage tout au long de votre parcours
      </h1>
      <div className="grid gap-4">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-white border border-gray-200 hover:border-gray-300 p-5 rounded-xl transition-colors shadow-sm"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900">{r.titre}</h2>
                <p className="text-sm text-gray-500">{r.convention?.application?.student?.user?.name}</p>
                <a
                  href={fileUrlPrefix + r.fichier_path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-700 hover:text-purple-800 text-sm underline"
                >
                  Voir le rapport
                </a>
                {r.commentaire ? (
                  <p className="text-sm text-gray-500 mt-1">Commentaire : {r.commentaire}</p>
                ) : null}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUT_COLORS[r.statut]}`}>
                {STATUT_LABELS[r.statut]}
              </span>
            </div>
          </div>
        ))}
        {reports.length === 0 && <p className="text-gray-500">Aucun rapport.</p>}
      </div>

      {user?.role === "etudiant" ? (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="font-semibold mb-3 text-gray-900">Déposer un rapport</h2>

          {conventionsWithoutReport.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune convention disponible pour un nouveau rapport pour le moment.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={conventionId}
                onChange={(e) => setConventionId(e.target.value)}
                className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg text-gray-900 text-sm min-w-[220px]"
              >
                <option value="">Sélectionner une convention</option>
                {conventionsWithoutReport.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.application?.offer?.titre} — {c.application?.offer?.company?.nom}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Titre du rapport"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg text-gray-900 placeholder-gray-400 text-sm"
              />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-sm text-gray-700 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-purple-600 file:text-white file:text-xs"
              />
              <button
                onClick={handleUpload}
                disabled={!file || !titre || !conventionId || submitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {submitting ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
