import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const STATUT_LABELS = {
  en_attente: "En attente",
  planifie: "Planifié",
  reporte: "Reporté",
  termine: "Terminé",
  annule: "Annulé",
};
const STATUT_DOT = {
  en_attente: "bg-amber-500",
  planifie: "bg-sky-500",
  reporte: "bg-orange-500",
  termine: "bg-green-500",
  annule: "bg-red-500",
};
const STATUT_COLORS = {
  en_attente: "bg-amber-500/15 text-amber-600",
  planifie: "bg-sky-500/15 text-sky-600",
  reporte: "bg-orange-500/15 text-orange-600",
  termine: "bg-green-500/15 text-green-600",
  annule: "bg-red-500/15 text-red-600",
};
const DECISION_LABELS = { retenu: "Retenu", refuse: "Refusé", en_attente: "En attente" };

function StatutBadge({ statut }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${STATUT_COLORS[statut]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${STATUT_DOT[statut]}`} />
      {STATUT_LABELS[statut] || statut}
    </span>
  );
}

export default function Entretiens() {
  const { user } = useAuth();
  const { notify } = useToast();
  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Candidatures disponibles pour planifier un entretien (entreprise)
  const [applications, setApplications] = useState([]);

  // Formulaire de planification (entreprise)
  const [applicationId, setApplicationId] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [mode, setMode] = useState("visio");
  const [lieu, setLieu] = useState("");
  const [lienVisio, setLienVisio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Formulaire de gestion (entreprise) sur une ligne dépliée
  const [editDate, setEditDate] = useState("");
  const [editHeure, setEditHeure] = useState("");
  const [editDecision, setEditDecision] = useState("en_attente");
  const [editCommentaire, setEditCommentaire] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get("/entretiens")
      .then((res) => setEntretiens(res.data))
      .catch(() => notify("Impossible de charger les entretiens.", "error"))
      .finally(() => setLoading(false));
  };

  const loadApplications = () => {
    if (user?.role !== "entreprise") return;
    api.get("/applications").then((res) => {
      const eligible = res.data.filter((a) => a.statut === "acceptee");
      setApplications(eligible);
    });
  };

  useEffect(load, []);
  useEffect(loadApplications, [user]);

  const stats = useMemo(() => {
    const counts = { planifie: 0, termine: 0, annule: 0, en_attente: 0, reporte: 0 };
    entretiens.forEach((e) => {
      counts[e.statut] = (counts[e.statut] || 0) + 1;
    });
    return counts;
  }, [entretiens]);

  const handlePlanifier = async (e) => {
    e.preventDefault();
    if (!applicationId || !date || !heure) return;
    setSubmitting(true);
    try {
      await api.post("/entretiens", {
        application_id: applicationId,
        date,
        heure,
        mode,
        lieu: mode === "presentiel" ? lieu : null,
        lien_visio: mode === "visio" ? lienVisio : null,
      });
      notify("Entretien planifié.", "success");
      setApplicationId("");
      setDate("");
      setHeure("");
      setLieu("");
      setLienVisio("");
      load();
    } catch (err) {
      notify(err.response?.data?.message || "Impossible de planifier l'entretien.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await api.put(`/entretiens/${id}/confirm`);
      notify("Participation confirmée.", "success");
      load();
    } catch {
      notify("Action impossible.", "error");
    }
  };

  const handleRefuse = async (id) => {
    try {
      await api.put(`/entretiens/${id}/refuse`);
      notify("Entretien refusé.", "success");
      load();
    } catch {
      notify("Action impossible.", "error");
    }
  };

  const handleReporter = async (id) => {
    try {
      await api.put(`/entretiens/${id}`, { date: editDate, heure: editHeure, statut: "reporte" });
      notify("Entretien reporté.", "success");
      setExpandedId(null);
      load();
    } catch {
      notify("Impossible de reporter l'entretien.", "error");
    }
  };

  const handleAnnuler = async (id) => {
    try {
      await api.put(`/entretiens/${id}`, { statut: "annule" });
      notify("Entretien annulé.", "success");
      load();
    } catch {
      notify("Impossible d'annuler l'entretien.", "error");
    }
  };

  const handleDecision = async (id) => {
    try {
      await api.put(`/entretiens/${id}`, {
        decision: editDecision,
        commentaire: editCommentaire,
        statut: "termine",
      });
      notify("Décision enregistrée.", "success");
      setExpandedId(null);
      load();
    } catch {
      notify("Impossible d'enregistrer la décision.", "error");
    }
  };

  const openRow = (ent) => {
    if (expandedId === ent.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(ent.id);
    setEditDate(ent.date?.slice(0, 10) || "");
    setEditHeure(ent.heure?.slice(0, 5) || "");
    setEditDecision(ent.decision || "en_attente");
    setEditCommentaire(ent.commentaire || "");
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {user?.role === "admin" && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            ["en_attente", "En attente"],
            ["planifie", "Planifiés"],
            ["reporte", "Reportés"],
            ["termine", "Terminés"],
            ["annule", "Annulés"],
          ].map(([key, label]) => (
            <div key={key} className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">{stats[key] || 0}</p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      {user?.role === "entreprise" && (
        <form
          onSubmit={handlePlanifier}
          className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm"
        >
          <h2 className="font-semibold text-gray-900">Planifier un entretien</h2>

          {applications.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aucune candidature acceptée disponible pour planifier un entretien.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <select
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg text-gray-900 text-sm min-w-[220px]"
              >
                <option value="">Sélectionner un candidat</option>
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.student?.user?.name} — {app.offer?.titre}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg text-gray-900 text-sm"
              />
              <input
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg text-gray-900 text-sm"
              />
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg text-gray-900 text-sm"
              >
                <option value="visio">En ligne</option>
                <option value="presentiel">Présentiel</option>
              </select>
              {mode === "visio" ? (
                <input
                  type="text"
                  placeholder="Lien Zoom / Meet / Teams"
                  value={lienVisio}
                  onChange={(e) => setLienVisio(e.target.value)}
                  className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg flex-1 min-w-[200px] text-gray-900 text-sm"
                />
              ) : (
                <input
                  type="text"
                  placeholder="Lieu"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  className="bg-white border border-gray-300 focus:border-purple-500 outline-none p-2 rounded-lg flex-1 min-w-[200px] text-gray-900 text-sm"
                />
              )}
              <button
                type="submit"
                disabled={submitting || !applicationId}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {submitting ? "Envoi..." : "Planifier"}
              </button>
            </div>
          )}
        </form>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Étudiant</th>
                <th className="text-left px-4 py-3">Entreprise</th>
                <th className="text-left px-4 py-3">Offre</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Heure</th>
                <th className="text-left px-4 py-3">Mode</th>
                <th className="text-left px-4 py-3">Statut</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {entretiens.map((ent) => {
                const app = ent.application;
                const isExpanded = expandedId === ent.id;
                return (
                  <>
                    <tr key={ent.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-900">{app?.student?.user?.name}</td>
                      <td className="px-4 py-3 text-gray-500">{app?.offer?.company?.nom}</td>
                      <td className="px-4 py-3 text-gray-500">{app?.offer?.titre}</td>
                      <td className="px-4 py-3 text-gray-500">{ent.date?.slice(0, 10)}</td>
                      <td className="px-4 py-3 text-gray-500">{ent.heure?.slice(0, 5)}</td>
                      <td className="px-4 py-3 text-gray-500">{ent.mode === "visio" ? "En ligne" : "Présentiel"}</td>
                      <td className="px-4 py-3">
                        <StatutBadge statut={ent.statut} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openRow(ent)}
                          className="text-purple-700 hover:text-purple-800 font-medium underline underline-offset-2"
                        >
                          {isExpanded ? "Fermer" : "Voir"}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="border-t border-gray-100 bg-gray-50">
                        <td colSpan={8} className="px-4 py-4 space-y-3">
                          <div className="flex flex-wrap gap-4 text-gray-600">
                            <span>
                              <strong className="text-gray-900">Lieu / lien :</strong>{" "}
                              {ent.mode === "visio" ? (
                                <a
                                  href={ent.lien_visio}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-purple-700 underline"
                                >
                                  {ent.lien_visio}
                                </a>
                              ) : (
                                ent.lieu
                              )}
                            </span>
                            {ent.commentaire && (
                              <span>
                                <strong className="text-gray-900">Commentaire :</strong> {ent.commentaire}
                              </span>
                            )}
                            {ent.decision !== "en_attente" && (
                              <span>
                                <strong className="text-gray-900">Décision :</strong> {DECISION_LABELS[ent.decision]}
                              </span>
                            )}
                          </div>

                          {/* Actions étudiant */}
                          {user?.role === "etudiant" && ent.statut !== "annule" && ent.statut !== "termine" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleConfirm(ent.id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm"
                              >
                                Confirmer ma présence
                              </button>
                              <button
                                onClick={() => handleRefuse(ent.id)}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
                              >
                                Refuser
                              </button>
                            </div>
                          )}

                          {/* Actions entreprise */}
                          {user?.role === "entreprise" && (
                            <div className="space-y-3">
                              <div className="flex flex-wrap gap-2 items-center">
                                <input
                                  type="date"
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                  className="bg-white border border-gray-300 p-2 rounded-lg text-sm"
                                />
                                <input
                                  type="time"
                                  value={editHeure}
                                  onChange={(e) => setEditHeure(e.target.value)}
                                  className="bg-white border border-gray-300 p-2 rounded-lg text-sm"
                                />
                                <button
                                  onClick={() => handleReporter(ent.id)}
                                  className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm"
                                >
                                  Reporter
                                </button>
                                <button
                                  onClick={() => handleAnnuler(ent.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm"
                                >
                                  Annuler
                                </button>
                              </div>

                              <div className="flex flex-wrap gap-2 items-start">
                                <select
                                  value={editDecision}
                                  onChange={(e) => setEditDecision(e.target.value)}
                                  className="bg-white border border-gray-300 p-2 rounded-lg text-sm"
                                >
                                  <option value="en_attente">En attente</option>
                                  <option value="retenu">Retenu</option>
                                  <option value="refuse">Refusé</option>
                                </select>
                                <textarea
                                  placeholder="Commentaire après entretien"
                                  value={editCommentaire}
                                  onChange={(e) => setEditCommentaire(e.target.value)}
                                  className="bg-white border border-gray-300 p-2 rounded-lg text-sm flex-1 min-w-[200px] h-16 resize-none"
                                />
                                <button
                                  onClick={() => handleDecision(ent.id)}
                                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm"
                                >
                                  Enregistrer la décision
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        {entretiens.length === 0 && <p className="text-gray-500 p-6 text-center">Aucun entretien pour le moment.</p>}
      </div>
    </div>
  );
}
