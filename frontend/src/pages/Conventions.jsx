import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUT_LABELS = {
  en_preparation: "En préparation",
  signee: "Signée",
  validee_admin: "Validée",
  rejetee: "Rejetée",
};
const STATUT_COLORS = {
  en_preparation: "bg-gray-100 text-gray-600",
  signee: "bg-amber-500/15 text-amber-600",
  validee_admin: "bg-green-500/15 text-green-600",
  rejetee: "bg-red-500/15 text-red-600",
};

export default function Conventions() {
  const { user } = useAuth();
  const [conventions, setConventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/conventions")
      .then((res) => setConventions(res.data))
      .finally(() => setLoading(false));
  };

  const loadAcceptedApplications = () => {
    if (user?.role !== "etudiant") return;
    api.get("/applications").then((res) => {
      const accepted = res.data.filter((a) => a.statut === "acceptee");
      setAcceptedApplications(accepted);
    });
  };

  useEffect(load, []);
  useEffect(loadAcceptedApplications, [user]);

  const handleUpload = async () => {
    if (!file || !selectedApplicationId) return;

    const data = new FormData();
    data.append("application_id", selectedApplicationId);
    data.append("fichier", file);

    setSubmitting(true);
    try {
      await api.post("/conventions", data);
      setSelectedApplicationId("");
      setFile(null);
      load();
      loadAcceptedApplications();
    } catch (err) {
      console.error("Erreur upload convention :", err.response && err.response.data);
      alert(
        (err.response && err.response.data && err.response.data.message) ||
          "Impossible d'envoyer la convention."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;

  const fileUrlPrefix = "http://localhost:8000/storage/";

  const applicationsWithoutConvention = acceptedApplications.filter(
    (app) => !conventions.some((c) => c.application_id === app.id)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-gray-900">
        Suivez l'état de vos conventions de stage et consultez les différentes étapes de leur validation.
      </h1>
      <div className="grid gap-4">
        {conventions.map((conv) => (
          <div
            key={conv.id}
            className="bg-white border border-gray-200 hover:border-gray-300 p-5 rounded-xl transition-colors shadow-sm"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900">
                  {conv.application?.student?.user?.name} — {conv.application?.offer?.titre}
                </h2>
                <p className="text-sm text-gray-500">{conv.application?.offer?.company?.nom}</p>
                {conv.fichier_path ? (
                  <a
                    href={fileUrlPrefix + conv.fichier_path}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 hover:text-purple-800 text-sm underline"
                  >
                    Voir le fichier
                  </a>
                ) : null}
                {conv.commentaire_admin ? (
                  <p className="text-sm text-gray-500 mt-1">Commentaire : {conv.commentaire_admin}</p>
                ) : null}
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUT_COLORS[conv.statut]}`}>
                {STATUT_LABELS[conv.statut]}
              </span>
            </div>
          </div>
        ))}
        {conventions.length === 0 && <p className="text-gray-500">Aucune convention.</p>}
      </div>

      {user?.role === "etudiant" ? (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="font-semibold mb-2 text-gray-900">Déposer une convention signée</h2>

          {applicationsWithoutConvention.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune candidature acceptée en attente de convention pour le moment.
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-3">
                Choisis la candidature concernée puis sélectionne le fichier PDF.
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={selectedApplicationId}
                  onChange={(e) => setSelectedApplicationId(e.target.value)}
                  className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg text-gray-900 text-sm min-w-[220px]"
                >
                  <option value="">Sélectionner une candidature</option>
                  {applicationsWithoutConvention.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.offer?.titre} — {app.offer?.company?.nom}
                    </option>
                  ))}
                </select>

                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-sm text-gray-700 bg-white border border-gray-300 rounded-lg p-2 cursor-pointer file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-purple-600 file:text-white file:text-xs"
                />

                <button
                  onClick={handleUpload}
                  disabled={!file || !selectedApplicationId || submitting}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {submitting ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
