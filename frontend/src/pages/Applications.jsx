import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const STATUT_LABELS = { en_attente: "En attente", acceptee: "Acceptée", refusee: "Refusée" };
const STATUT_COLORS = {
  en_attente: "bg-amber-500/15 text-amber-600",
  acceptee: "bg-green-500/15 text-green-600",
  refusee: "bg-red-500/15 text-red-600",
};

function InfoField({ label, value, color = "purple" }) {
  const colors = {
    purple: "bg-purple-50 border-purple-100 text-purple-900",
    blue: "bg-blue-50 border-blue-100 text-blue-900",
    green: "bg-green-50 border-green-100 text-green-900",
    amber: "bg-amber-50 border-amber-100 text-amber-900",
  };
  return (
    <div className={`rounded-lg border p-3 ${colors[color]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-60">{label}</p>
      <p className="font-semibold mt-0.5">{value}</p>
    </div>
  );
}

function DetailsModal({ app, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header coloré */}
        <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 p-5 shrink-0">
          <h2 className="font-bold text-lg text-white">Détails de la candidature</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          {/* Infos personnelles */}
          <div>
            <h3 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Informations personnelles
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoField label="Nom complet" value={app.student?.user?.name || "—"} color="purple" />
              <InfoField label="Email" value={app.student?.user?.email || "—"} color="purple" />
              <div className="col-span-2">
                <InfoField label="Téléphone" value={app.student?.telephone || "Non renseigné"} color="purple" />
              </div>
            </div>
          </div>

          {/* Infos académiques */}
          <div>
            <h3 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Informations académiques
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoField label="Filière" value={app.student?.filiere || "Non renseigné"} color="blue" />
              <InfoField label="Niveau" value={app.student?.niveau || "Non renseigné"} color="blue" />
            </div>
          </div>

          {/* Message */}
          <div>
            <h3 className="font-semibold text-sm text-amber-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Message du candidat
            </h3>
            <p className="text-sm bg-amber-50 border border-amber-100 rounded-lg p-3 text-amber-900">
              {app.message || "Aucun message laissé par le candidat."}
            </p>
          </div>

          {/* Documents */}
          <div>
            <h3 className="font-semibold text-sm text-green-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Documents
            </h3>
            <div className="flex flex-wrap gap-3">
              {app.cv_path && (
                <a
                  href={`http://localhost:8000/storage/${app.cv_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  📄 Voir le CV
                </a>
              )}
              {app.lettre_motivation_path && (
                <a
                  href={`http://localhost:8000/storage/${app.lettre_motivation_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  ✉️ Voir la lettre
                </a>
              )}
              {!app.cv_path && !app.lettre_motivation_path && (
                <p className="text-sm text-gray-400">Aucun document fourni.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  const load = () => {
    setLoading(true);
    api.get("/applications").then((res) => setApplications(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, statut) => {
    await api.patch(`/applications/${id}/statut`, { statut });
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, statut } : a)));
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-6 text-gray-900">Consultez et suivez toutes vos candidatures en un seul endroit.</h1>
      <div className="grid gap-4">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-gray-200 hover:border-purple-200 hover:shadow-md p-5 rounded-xl transition-all shadow-sm"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900">{app.offer?.titre}</h2>
                <p className="text-sm text-gray-500">{app.offer?.company?.nom}</p>
                {user?.role !== "etudiant" && (
                  <p className="text-sm text-gray-500">Candidat : {app.student?.user?.name}</p>
                )}
                <div className="flex gap-3 mt-1 text-sm">
                  {app.cv_path && (
                    <a
                      href={`http://localhost:8000/storage/${app.cv_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 hover:text-purple-800 underline"
                    >
                      CV
                    </a>
                  )}
                  {app.lettre_motivation_path && (
                    <a
                      href={`http://localhost:8000/storage/${app.lettre_motivation_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 hover:text-purple-800 underline"
                    >
                      Lettre de motivation
                    </a>
                  )}
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUT_COLORS[app.statut]}`}>
                {STATUT_LABELS[app.statut]}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              {user?.role === "entreprise" && (
                <button
                  onClick={() => setSelectedApp(app)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  👁️ Voir les informations du candidat
                </button>
              )}

              {user?.role === "entreprise" && app.statut === "en_attente" && (
                <>
                  <button
                    onClick={() => handleStatusChange(app.id, "acceptee")}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => handleStatusChange(app.id, "refusee")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    Refuser
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {applications.length === 0 && <p className="text-gray-500">Aucune candidature pour le moment.</p>}
      </div>

      {selectedApp && <DetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
    </div>
  );
}
