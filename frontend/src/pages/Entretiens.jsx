import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/* =========================================================
   CONFIGURATION DES STATUTS
========================================================= */

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
  en_attente: "bg-amber-50 text-amber-700",
  planifie: "bg-sky-50 text-sky-700",
  reporte: "bg-orange-50 text-orange-700",
  termine: "bg-green-50 text-green-700",
  annule: "bg-red-50 text-red-700",
};

const DECISION_LABELS = {
  retenu: "Retenu",
  refuse: "Refusé",
  en_attente: "En attente",
};

/* =========================================================
   BADGE STATUT
========================================================= */

function StatutBadge({ statut }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1
        rounded-full
        text-xs font-medium
        ${STATUT_COLORS[statut] || "bg-gray-100 text-gray-600"}
      `}
    >
      <span
        className={`
          w-1.5 h-1.5
          rounded-full
          ${STATUT_DOT[statut] || "bg-gray-400"}
        `}
      />

      {STATUT_LABELS[statut] || statut || "—"}
    </span>
  );
}

/* =========================================================
   PAGE ENTRETIENS
========================================================= */

export default function Entretiens() {
  const { user } = useAuth();
  const { notify } = useToast();

  /* ---------------------------------------------------------
     DATA
  --------------------------------------------------------- */

  const [entretiens, setEntretiens] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [expandedId, setExpandedId] = useState(null);

  /* ---------------------------------------------------------
     FORMULAIRE PLANIFICATION
  --------------------------------------------------------- */

  const [applicationId, setApplicationId] = useState("");
  const [date, setDate] = useState("");
  const [heure, setHeure] = useState("");
  const [mode, setMode] = useState("visio");
  const [lieu, setLieu] = useState("");
  const [lienVisio, setLienVisio] = useState("");

  /* ---------------------------------------------------------
     FORMULAIRE MODIFICATION
  --------------------------------------------------------- */

  const [editDate, setEditDate] = useState("");
  const [editHeure, setEditHeure] = useState("");
  const [editDecision, setEditDecision] = useState("en_attente");
  const [editCommentaire, setEditCommentaire] = useState("");

  /* =========================================================
     CHARGER LES ENTRETIENS
  ========================================================= */

  const load = async () => {
    setLoading(true);

    try {
      const res = await api.get("/entretiens");

      setEntretiens(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);

      notify(
        "Impossible de charger les entretiens.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     CHARGER LES CANDIDATURES ACCEPTÉES
  ========================================================= */

  const loadApplications = async () => {
    if (user?.role !== "entreprise") {
      return;
    }

    try {
      const res = await api.get("/applications");

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      const eligible = data.filter(
        (application) =>
          application.statut === "acceptee"
      );

      setApplications(eligible);
    } catch (error) {
      console.error(error);

      notify(
        "Impossible de charger les candidatures.",
        "error"
      );
    }
  };

  /* =========================================================
     USE EFFECT
  ========================================================= */

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    loadApplications();
  }, [user]);

  /* =========================================================
     STATISTIQUES
  ========================================================= */

  const stats = useMemo(() => {
    const counts = {
      en_attente: 0,
      planifie: 0,
      reporte: 0,
      termine: 0,
      annule: 0,
    };

    entretiens.forEach((entretien) => {
      if (counts[entretien.statut] !== undefined) {
        counts[entretien.statut]++;
      }
    });

    return counts;
  }, [entretiens]);

  /* =========================================================
     PLANIFIER UN ENTRETIEN
  ========================================================= */

  const handlePlanifier = async (e) => {
    e.preventDefault();

    if (!applicationId || !date || !heure) {
      notify(
        "Veuillez remplir les champs obligatoires.",
        "error"
      );

      return;
    }

    if (mode === "visio" && !lienVisio) {
      notify(
        "Veuillez renseigner le lien de visioconférence.",
        "error"
      );

      return;
    }

    if (mode === "presentiel" && !lieu) {
      notify(
        "Veuillez renseigner le lieu de l'entretien.",
        "error"
      );

      return;
    }

    setSubmitting(true);

    try {
      await api.post("/entretiens", {
        application_id: applicationId,
        date,
        heure,
        mode,
        lieu:
          mode === "presentiel"
            ? lieu
            : null,
        lien_visio:
          mode === "visio"
            ? lienVisio
            : null,
      });

      notify(
        "Entretien planifié avec succès.",
        "success"
      );

      setApplicationId("");
      setDate("");
      setHeure("");
      setMode("visio");
      setLieu("");
      setLienVisio("");

      await load();
    } catch (error) {
      console.error(error);

      notify(
        error.response?.data?.message ||
          "Impossible de planifier l'entretien.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================================================
     CONFIRMER PARTICIPATION
  ========================================================= */

  const handleConfirm = async (id) => {
    try {
      await api.put(`/entretiens/${id}/confirm`);

      notify(
        "Participation confirmée.",
        "success"
      );

      await load();
    } catch (error) {
      console.error(error);

      notify(
        "Action impossible.",
        "error"
      );
    }
  };

  /* =========================================================
     REFUSER PARTICIPATION
  ========================================================= */

  const handleRefuse = async (id) => {
    try {
      await api.put(`/entretiens/${id}/refuse`);

      notify(
        "Entretien refusé.",
        "success"
      );

      await load();
    } catch (error) {
      console.error(error);

      notify(
        "Action impossible.",
        "error"
      );
    }
  };

  /* =========================================================
     REPORTER
  ========================================================= */

  const handleReporter = async (id) => {
    if (!editDate || !editHeure) {
      notify(
        "Veuillez sélectionner une nouvelle date et une nouvelle heure.",
        "error"
      );

      return;
    }

    try {
      await api.put(`/entretiens/${id}`, {
        date: editDate,
        heure: editHeure,
        statut: "reporte",
      });

      notify(
        "Entretien reporté avec succès.",
        "success"
      );

      setExpandedId(null);

      await load();
    } catch (error) {
      console.error(error);

      notify(
        "Impossible de reporter l'entretien.",
        "error"
      );
    }
  };

  /* =========================================================
     ANNULER
  ========================================================= */

  const handleAnnuler = async (id) => {
    try {
      await api.put(`/entretiens/${id}`, {
        statut: "annule",
      });

      notify(
        "Entretien annulé.",
        "success"
      );

      await load();
    } catch (error) {
      console.error(error);

      notify(
        "Impossible d'annuler l'entretien.",
        "error"
      );
    }
  };

  /* =========================================================
     ENREGISTRER LA DÉCISION
  ========================================================= */

  const handleDecision = async (id) => {
    try {
      await api.put(`/entretiens/${id}`, {
        decision: editDecision,
        commentaire: editCommentaire,
        statut: "termine",
      });

      notify(
        "Décision enregistrée avec succès.",
        "success"
      );

      setExpandedId(null);

      await load();
    } catch (error) {
      console.error(error);

      notify(
        "Impossible d'enregistrer la décision.",
        "error"
      );
    }
  };

  /* =========================================================
     OUVRIR / FERMER UNE LIGNE
  ========================================================= */

  const openRow = (entretien) => {
    if (expandedId === entretien.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(entretien.id);

    setEditDate(
      entretien.date?.slice(0, 10) || ""
    );

    setEditHeure(
      entretien.heure?.slice(0, 5) || ""
    );

    setEditDecision(
      entretien.decision || "en_attente"
    );

    setEditCommentaire(
      entretien.commentaire || ""
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-sm text-gray-500">
            Chargement des entretiens...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Entretiens
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Gestion et suivi des entretiens
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {entretiens.length} entretien
          {entretiens.length > 1 ? "s" : ""}
        </div>

      </div>

      {/* =====================================================
          STATISTIQUES ADMIN
      ===================================================== */}

      {user?.role === "admin" && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">

          {[
            ["en_attente", "En attente"],
            ["planifie", "Planifiés"],
            ["reporte", "Reportés"],
            ["termine", "Terminés"],
            ["annule", "Annulés"],
          ].map(([key, label]) => (
            <div
              key={key}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3"
            >

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-500">
                    {label}
                  </p>

                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {stats[key] || 0}
                  </p>
                </div>

                <span
                  className={`
                    w-2.5 h-2.5
                    rounded-full
                    ${STATUT_DOT[key]}
                  `}
                />

              </div>

            </div>
          ))}

        </div>
      )}

      {/* =====================================================
          FORMULAIRE ENTREPRISE
      ===================================================== */}

      {user?.role === "entreprise" && (
        <form
          onSubmit={handlePlanifier}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >

          <div className="flex items-center justify-between mb-4">

            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Planifier un entretien
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Sélectionnez une candidature acceptée.
              </p>
            </div>

          </div>

          {applications.length === 0 ? (

            <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">

              <p className="text-sm text-gray-500">
                Aucune candidature acceptée disponible
                pour planifier un entretien.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

              {/* Candidat */}

              <select
                value={applicationId}
                onChange={(e) =>
                  setApplicationId(e.target.value)
                }
                className="w-full bg-white border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none p-2.5 rounded-lg text-gray-900 text-sm"
              >

                <option value="">
                  Sélectionner un candidat
                </option>

                {applications.map((application) => (
                  <option
                    key={application.id}
                    value={application.id}
                  >
                    {application.student?.user?.name ||
                      "Candidat"}{" "}
                    —{" "}
                    {application.offer?.titre ||
                      "Offre"}
                  </option>
                ))}

              </select>

              {/* Date */}

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                className="w-full bg-white border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none p-2.5 rounded-lg text-gray-900 text-sm"
              />

              {/* Heure */}

              <input
                type="time"
                value={heure}
                onChange={(e) =>
                  setHeure(e.target.value)
                }
                className="w-full bg-white border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none p-2.5 rounded-lg text-gray-900 text-sm"
              />

              {/* Mode */}

              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value)
                }
                className="w-full bg-white border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none p-2.5 rounded-lg text-gray-900 text-sm"
              >

                <option value="visio">
                  En ligne
                </option>

                <option value="presentiel">
                  Présentiel
                </option>

              </select>

              {/* Lieu / lien */}

              <div className="lg:col-span-3">

                {mode === "visio" ? (

                  <input
                    type="url"
                    placeholder="Lien Zoom / Meet / Teams"
                    value={lienVisio}
                    onChange={(e) =>
                      setLienVisio(e.target.value)
                    }
                    className="w-full bg-white border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none p-2.5 rounded-lg text-gray-900 text-sm"
                  />

                ) : (

                  <input
                    type="text"
                    placeholder="Lieu de l'entretien"
                    value={lieu}
                    onChange={(e) =>
                      setLieu(e.target.value)
                    }
                    className="w-full bg-white border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none p-2.5 rounded-lg text-gray-900 text-sm"
                  />

                )}

              </div>

              {/* Bouton */}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !applicationId ||
                  !date ||
                  !heure
                }
                className="w-full bg-[#08B7C9] hover:bg-[#079FAF] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Planification..."
                  : "Planifier"}
              </button>

            </div>

          )}

        </form>
      )}

      {/* =====================================================
          TABLEAU
      ===================================================== */}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">

          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              Liste des entretiens
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Consultez les informations et les actions disponibles.
            </p>
          </div>

        </div>

        {entretiens.length === 0 ? (

          <div className="p-8 text-center">

            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-lg">
                —
              </span>
            </div>

            <p className="text-sm font-medium text-gray-700">
              Aucun entretien
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Aucun entretien n'est disponible pour le moment.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>

                <tr className="bg-gray-50 border-b border-gray-100">

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Étudiant
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Entreprise
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Offre
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Date
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Heure
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Mode
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Statut
                  </th>

                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {entretiens.map((ent) => {

                  const app = ent.application;

                  const isExpanded =
                    expandedId === ent.id;

                  return (
                    <React.Fragment key={ent.id}>

                      {/* =========================================
                          LIGNE PRINCIPALE
                      ========================================= */}

                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">

                        <td className="px-4 py-3 text-gray-900 font-medium">
                          {app?.student?.user?.name ||
                            "—"}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {app?.offer?.company?.nom ||
                            "—"}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {app?.offer?.titre ||
                            "—"}
                        </td>

                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {ent.date?.slice(0, 10) ||
                            "—"}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {ent.heure?.slice(0, 5) ||
                            "—"}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {ent.mode === "visio"
                            ? "En ligne"
                            : "Présentiel"}
                        </td>

                        <td className="px-4 py-3">
                          <StatutBadge
                            statut={ent.statut}
                          />
                        </td>

                        <td className="px-4 py-3">

                          <button
                            type="button"
                            onClick={() =>
                              openRow(ent)
                            }
                            className="text-[#08B7C9] hover:text-[#079FAF] text-sm font-medium"
                          >
                            {isExpanded
                              ? "Fermer"
                              : "Voir"}
                          </button>

                        </td>

                      </tr>

                      {/* =========================================
                          DETAILS
                      ========================================= */}

                      {isExpanded && (
                        <tr className="border-b border-gray-100 bg-gray-50">

                          <td
                            colSpan={8}
                            className="px-4 py-4"
                          >

                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                              {/* HEADER DETAILS */}

                              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">

                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">
                                    Détails de l'entretien
                                  </h3>

                                  <p className="text-xs text-gray-500 mt-0.5">
                                    Informations et actions disponibles
                                  </p>
                                </div>

                                <StatutBadge
                                  statut={ent.statut}
                                />

                              </div>

                              {/* INFORMATIONS PRINCIPALES */}

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">

                                {/* DATE */}

                                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">

                                  <p className="text-xs text-gray-500 mb-1">
                                    Date
                                  </p>

                                  <p className="text-sm font-medium text-gray-900">
                                    {ent.date?.slice(
                                      0,
                                      10
                                    ) || "—"}
                                  </p>

                                </div>

                                {/* HEURE */}

                                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">

                                  <p className="text-xs text-gray-500 mb-1">
                                    Heure
                                  </p>

                                  <p className="text-sm font-medium text-gray-900">
                                    {ent.heure?.slice(
                                      0,
                                      5
                                    ) || "—"}
                                  </p>

                                </div>

                                {/* MODE */}

                                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">

                                  <p className="text-xs text-gray-500 mb-1">
                                    Mode
                                  </p>

                                  <p className="text-sm font-medium text-gray-900">
                                    {ent.mode ===
                                    "visio"
                                      ? "En ligne"
                                      : "Présentiel"}
                                  </p>

                                </div>

                                {/* CANDIDAT */}

                                <div className="border border-gray-100 rounded-lg p-3 bg-gray-50">

                                  <p className="text-xs text-gray-500 mb-1">
                                    Candidat
                                  </p>

                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {app
                                      ?.student
                                      ?.user
                                      ?.name ||
                                      "—"}
                                  </p>

                                </div>

                              </div>

                              {/* LIEU / LIEN */}

                              <div className="border border-gray-100 rounded-lg p-3 mb-3">

                                <p className="text-xs font-medium text-gray-500 mb-1">
                                  {ent.mode ===
                                  "visio"
                                    ? "Lien de visioconférence"
                                    : "Lieu de l'entretien"}
                                </p>

                                {ent.mode ===
                                "visio" ? (

                                  ent.lien_visio ? (

                                    <a
                                      href={
                                        ent.lien_visio
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                     className="inline-flex text-sm text-[#08B7C9] hover:text-[#079FAF] hover:underline break-all"
                                    >
                                      {
                                        ent.lien_visio
                                      }
                                    </a>

                                  ) : (

                                    <p className="text-sm text-gray-400">
                                      Aucun lien renseigné
                                    </p>

                                  )

                                ) : (

                                  <p className="text-sm text-gray-900">
                                    {ent.lieu ||
                                      "Aucun lieu renseigné"}
                                  </p>

                                )}

                              </div>

                              {/* COMMENTAIRE + DECISION */}

                              {(ent.commentaire ||
                                (ent.decision &&
                                  ent.decision !==
                                    "en_attente")) && (

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">

                                  {/* COMMENTAIRE */}

                                  {ent.commentaire && (

                                    <div className="border border-gray-100 rounded-lg p-3">

                                      <p className="text-xs font-medium text-gray-500 mb-1">
                                        Commentaire
                                      </p>

                                      <p className="text-sm text-gray-700 leading-relaxed">
                                        {
                                          ent.commentaire
                                        }
                                      </p>

                                    </div>

                                  )}

                                  {/* DECISION */}

                                  {ent.decision &&
                                    ent.decision !==
                                      "en_attente" && (

                                      <div className="border border-gray-100 rounded-lg p-3">

                                        <p className="text-xs font-medium text-gray-500 mb-1">
                                          Décision
                                        </p>

                                        <span
                                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                            ent.decision ===
                                            "retenu"
                                              ? "bg-green-50 text-green-700"
                                              : "bg-red-50 text-red-700"
                                          }`}
                                        >
                                          {DECISION_LABELS[
                                            ent
                                              .decision
                                          ] ||
                                            ent.decision}
                                        </span>

                                      </div>

                                    )}

                                </div>

                              )}

                              {/* =====================================
                                  ACTIONS ÉTUDIANT
                              ===================================== */}

                              {user?.role ===
                                "etudiant" &&
                                ent.statut !==
                                  "annule" &&
                                ent.statut !==
                                  "termine" && (

                                  <div className="border-t border-gray-100 pt-4">

                                    <p className="text-xs font-medium text-gray-700 mb-2">
                                      Actions
                                    </p>

                                    <div className="flex flex-wrap gap-2">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleConfirm(
                                            ent.id
                                          )
                                        }
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        Confirmer ma présence
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleRefuse(
                                            ent.id
                                          )
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                      >
                                        Refuser
                                      </button>

                                    </div>

                                  </div>

                                )}

                              {/* =====================================
                                  ACTIONS ENTREPRISE
                              ===================================== */}

                              {user?.role ===
                                "entreprise" && (

                                <div className="border-t border-gray-100 pt-4 space-y-4">

                                  <p className="text-xs font-medium text-gray-700">
                                    Gestion de l'entretien
                                  </p>

                                  {/* REPORTER / ANNULER */}

                                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">

                                    <p className="text-xs text-gray-500 mb-2">
                                      Modifier la date ou l'heure
                                    </p>

                                    <div className="flex flex-wrap gap-2 items-center">

                                      <input
                                        type="date"
                                        value={
                                          editDate
                                        }
                                        onChange={(e) =>
                                          setEditDate(
                                            e.target
                                              .value
                                          )
                                        }
                                        className="bg-white border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-[#08B7C9] focus:ring-[#08B7C9]"
                                      />

                                      <input
                                        type="time"
                                        value={
                                          editHeure
                                        }
                                        onChange={(e) =>
                                          setEditHeure(
                                            e.target
                                              .value
                                          )
                                        }
                                        className="bg-white border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                      />

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleReporter(
                                            ent.id
                                          )
                                        }
                                        disabled={
                                          ent.statut ===
                                            "annule" ||
                                          ent.statut ===
                                            "termine"
                                        }
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Reporter
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAnnuler(
                                            ent.id
                                          )
                                        }
                                        disabled={
                                          ent.statut ===
                                            "annule" ||
                                          ent.statut ===
                                            "termine"
                                        }
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Annuler
                                      </button>

                                    </div>

                                  </div>

                                  {/* DECISION */}

                                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">

                                    <p className="text-xs text-gray-500 mb-2">
                                      Résultat de l'entretien
                                    </p>

                                    <div className="flex flex-wrap gap-2 items-start">

                                      <select
                                        value={
                                          editDecision
                                        }
                                        onChange={(e) =>
                                          setEditDecision(
                                            e.target
                                              .value
                                          )
                                        }
                                        className="bg-white border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                      >

                                        <option value="en_attente">
                                          En attente
                                        </option>

                                        <option value="retenu">
                                          Retenu
                                        </option>

                                        <option value="refuse">
                                          Refusé
                                        </option>

                                      </select>

                                      <textarea
                                        placeholder="Ajouter un commentaire après l'entretien..."
                                        value={
                                          editCommentaire
                                        }
                                        onChange={(e) =>
                                          setEditCommentaire(
                                            e.target
                                              .value
                                          )
                                        }
                                        className="bg-white border border-gray-300 p-2 rounded-lg text-sm flex-1 min-w-[250px] h-20 resize-none outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                      />

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDecision(
                                            ent.id
                                          )
                                        }
                                        disabled={
                                          ent.statut ===
                                          "annule"
                                        }
                                        className="bg-[#08B7C9] hover:bg-[#079FAF] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        Enregistrer
                                      </button>

                                    </div>

                                  </div>

                                </div>

                              )}

                            </div>

                          </td>

                        </tr>
                      )}

                    </React.Fragment>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}