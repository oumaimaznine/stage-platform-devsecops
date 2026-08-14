import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
} from "../components/ui/Icons";

/* =========================================================
   TYPE META
========================================================= */

const TYPE_META = {
  stage_ete: {
    label: "Stage d'été",
    tone: "amber",
  },

  pfe: {
    label: "PFE",
    tone: "violet",
  },

  stage_observation: {
    label: "Stage d'observation",
    tone: "sky",
  },
};

/* =========================================================
   DATE
========================================================= */

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value) {
  if (!value) {
    return "Date non précisée";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

/* =========================================================
   TIMING
========================================================= */

function getTiming(dateDebut, dateFin) {
  if (!dateDebut || !dateFin) {
    return null;
  }

  const now = new Date();
  const start = new Date(dateDebut);
  const end = new Date(dateFin);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return null;
  }

  if (now < start) {
    const days = Math.ceil(
      (start.getTime() - now.getTime()) / 86400000
    );

    return {
      label:
        days <= 1
          ? "Débute demain"
          : `Débute dans ${days} j`,
      tone: "sky",
    };
  }

  if (now >= start && now <= end) {
    return {
      label: "En cours",
      tone: "emerald",
    };
  }

  return {
    label: "Terminée",
    tone: "neutral",
  };
}

/* =========================================================
   NORMALISATION
========================================================= */

function normalizeFavorite(item) {
  const offer =
    item?.internship_offer ||
    item?.internshipOffer ||
    item?.offer ||
    item;

  const company =
    offer?.company ||
    item?.company ||
    null;

  const offerId =
    offer?.id ??
    item?.internship_offer_id ??
    item?.internshipOfferId ??
    item?.offer_id ??
    item?.offerId ??
    null;

  return {
    ...offer,

    offer_id: offerId,

    company_id:
      company?.id ??
      offer?.company_id ??
      offer?.companyId ??
      item?.company_id ??
      item?.companyId ??
      null,

    entreprise:
      offer?.entreprise ||
      offer?.company_name ||
      offer?.companyName ||
      company?.name ||
      company?.nom ||
      "Entreprise",

    is_favorite: true,
  };
}

/* =========================================================
   COMPONENT
========================================================= */

export default function Favorites() {
  const { notify } = useToast();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [removingId, setRemovingId] = useState(null);

  /* =======================================================
     LOAD FAVORITES
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadFavorites = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/favorites");

        if (!mounted) {
          return;
        }

        console.log(
          "Favoris reçus :",
          response?.data
        );

        /*
         * Laravel peut retourner :
         *
         * [
         *   ...
         * ]
         *
         * ou :
         *
         * {
         *   favorites: [...]
         * }
         */

        const data =
          response?.data?.favorites ??
          response?.data?.data ??
          response?.data ??
          [];

        const normalized = Array.isArray(data)
          ? data
              .map(normalizeFavorite)
              .filter((item) => item.offer_id)
          : [];

        console.log(
          "Favoris normalisés :",
          normalized
        );

        setFavorites(normalized);
      } catch (err) {
        console.error(
          "Erreur chargement favoris :",
          err?.response?.data || err
        );

        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            "Impossible de charger vos offres favorites."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     REMOVE FAVORITE
  ======================================================= */

  const handleRemoveFavorite = async (offer) => {
    if (!offer || removingId) {
      return;
    }

    const offerId =
      offer.offer_id ??
      offer.id ??
      offer.internship_offer_id ??
      offer.internshipOfferId ??
      null;

    if (!offerId) {
      notify(
        "Impossible de retirer cette offre des favoris.",
        "error"
      );

      return;
    }

    setRemovingId(Number(offerId));

    try {
      const response = await api.delete(
        `/favorites/${offerId}`
      );

      console.log(
        "Favori supprimé :",
        response?.data
      );

      /*
       * Suppression immédiate de l'interface
       */

      setFavorites((previous) =>
        previous.filter(
          (item) =>
            Number(item.offer_id) !==
            Number(offerId)
        )
      );

      notify(
        response?.data?.message ||
          "Offre retirée de vos favoris.",
        "success"
      );
    } catch (err) {
      console.error(
        "Erreur suppression favori :",
        err?.response?.data || err
      );

      notify(
        err?.response?.data?.message ||
          "Impossible de retirer cette offre des favoris.",
        "error"
      );
    } finally {
      setRemovingId(null);
    }
  };

  /* =======================================================
     VIEW OFFER
  ======================================================= */

  const handleViewOffer = (offer) => {
    if (!offer) {
      return;
    }

    const offerId =
      offer.offer_id ??
      offer.id ??
      null;

    if (!offerId) {
      return;
    }

    /*
     * Si tu as une page details d'offre,
     * adapte simplement cette URL.
     */

    navigate(`/offers/${offerId}`);
  };

  /* =======================================================
     APPLY
  ======================================================= */

  const handleApply = async (offer) => {
    if (!offer) {
      return;
    }

    const offerId =
      offer.offer_id ??
      offer.id ??
      null;

    if (!offerId) {
      notify(
        "Identifiant de l'offre manquant.",
        "error"
      );

      return;
    }

    try {
      const response = await api.post(
        "/applications",
        {
          internship_offer_id: Number(offerId),
        }
      );

      notify(
        response?.data?.message ||
          "Votre candidature a été envoyée avec succès.",
        "success"
      );
    } catch (err) {
      console.error(
        "Erreur candidature :",
        err?.response?.data || err
      );

      const validationErrors =
        err?.response?.data?.errors;

      let message =
        err?.response?.data?.message ||
        "Impossible d'envoyer votre candidature.";

      if (
        validationErrors &&
        typeof validationErrors === "object"
      ) {
        const firstError =
          Object.values(validationErrors)?.[0];

        if (
          Array.isArray(firstError) &&
          firstError.length > 0
        ) {
          message = firstError[0];
        }
      }

      notify(message, "error");
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="w-full px-5 py-7 md:px-7">
        <div className="mx-auto max-w-6xl">

          <div className="mb-7">
            <div className="h-3 w-24 animate-pulse rounded bg-[#dfeaec]" />

            <div className="mt-3 h-7 w-64 animate-pulse rounded bg-[#e4edef]" />

            <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-[#e4edef]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-[360px]
                  animate-pulse
                  rounded-2xl
                  border
                  border-[#e4edef]
                  bg-white
                "
              />
            ))}

          </div>

        </div>
      </section>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <section className="w-full px-5 py-7 md:px-7">
        <div className="mx-auto max-w-6xl">

          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">

            <p className="text-sm font-bold text-red-700">
              Mes offres favorites
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="
                mt-4
                rounded-lg
                bg-red-600
                px-4
                py-2
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Réessayer
            </button>

          </div>

        </div>
      </section>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (favorites.length === 0) {
    return (
      <section className="w-full px-5 py-7 md:px-7">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}

          <div className="mb-8">

            <div className="mb-2 flex items-center gap-2">

              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                "
              >
                ♥
              </span>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#08B7C9]
                "
              >
                Mes favoris
              </span>

            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-[#123F4B]
              "
            >
              Mes offres favorites
            </h1>

            <p
              className="
                mt-1
                text-xs
                text-[#819399]
              "
            >
              Retrouvez ici les offres que vous avez
              enregistrées.
            </p>

          </div>

          {/* EMPTY */}

          <div
            className="
              flex
              min-h-[380px]
              flex-col
              items-center
              justify-center
              rounded-2xl
              border
              border-[#e4edef]
              bg-white
              px-6
              text-center
            "
          >

            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-[#EAFBFC]
                text-3xl
                text-[#08B7C9]
              "
            >
              ♥
            </div>

            <h2
              className="
                mt-5
                text-base
                font-bold
                text-[#123F4B]
              "
            >
              Aucun favori pour le moment
            </h2>

            <p
              className="
                mt-2
                max-w-md
                text-xs
                leading-5
                text-[#819399]
              "
            >
              Lorsque vous trouvez une offre qui vous
              intéresse, cliquez sur ♥ pour l'ajouter
              à vos favoris.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/recommendations")
              }
              className="
                mt-6
                rounded-xl
                bg-[#08B7C9]
                px-5
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-md
                shadow-[#08B7C9]/20
                transition
                hover:-translate-y-0.5
                hover:bg-[#079eae]
              "
            >
              Découvrir les recommandations
            </button>

          </div>

        </div>
      </section>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full px-5 py-7 md:px-7">
      <div className="mx-auto max-w-6xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>

            <div className="mb-2 flex items-center gap-2">

              <span
                className="
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                "
              >
                ♥
              </span>

              <span
                className="
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#08B7C9]
                "
              >
                Mes favoris
              </span>

            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-[#123F4B]
                md:text-3xl
              "
            >
              Mes offres favorites
            </h1>

            <p
              className="
                mt-1.5
                text-xs
                text-[#819399]
              "
            >
              Les opportunités que vous avez
              enregistrées pour les retrouver facilement.
            </p>

          </div>

          {/* COUNT */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-xl
              border
              border-[#dceff1]
              bg-white
              px-3
              py-2
            "
          >

            <span className="text-lg text-[#08B7C9]">
              ♥
            </span>

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  leading-none
                  text-[#123F4B]
                "
              >
                {favorites.length}
              </p>

              <p
                className="
                  mt-1
                  text-[9px]
                  font-medium
                  text-[#94A4A9]
                "
              >
                {favorites.length > 1
                  ? "offres favorites"
                  : "offre favorite"}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            GRID
        ================================================= */}

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {favorites.map((offer) => {
            const meta =
              TYPE_META[offer.type] || {
                label: offer.type || "Stage",
                tone: "neutral",
              };

            const timing = getTiming(
              offer.date_debut,
              offer.date_fin
            );

            const competences =
              typeof offer.competences_requises ===
              "string"
                ? offer.competences_requises
                    .split(",")
                    .map((item) =>
                      item.trim()
                    )
                    .filter(Boolean)
                : Array.isArray(
                    offer.competences_requises
                  )
                ? offer.competences_requises
                    .map((item) =>
                      String(item).trim()
                    )
                    .filter(Boolean)
                : [];

            const offerId =
              offer.offer_id ??
              offer.id;

            return (
              <article
                key={offerId}
                className="
                  group
                  flex
                  flex-col
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#e2edef]
                  bg-white
                  shadow-[0_4px_18px_rgba(18,63,75,0.05)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#bde9ed]
                  hover:shadow-[0_12px_30px_rgba(18,63,75,0.10)]
                "
              >

                {/* TOP ACCENT */}

                <div className="h-1 bg-[#08B7C9]" />

                <div className="flex flex-1 flex-col p-5">

                  {/* =================================================
                      COMPANY
                  ================================================= */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-3
                      "
                    >

                      <Avatar
                        name={
                          offer.entreprise ||
                          "Entreprise"
                        }
                        square
                        size="md"
                      />

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-sm
                            font-semibold
                            text-[#123F4B]
                          "
                        >
                          {offer.entreprise ||
                            "Entreprise"}
                        </p>

                        <p
                          className="
                            mt-0.5
                            flex
                            items-center
                            gap-1
                            text-[10px]
                            text-[#94A4A9]
                          "
                        >
                          <IconBuilding className="h-3 w-3" />

                          Entreprise
                        </p>

                      </div>

                    </div>

                    {/* FAVORITE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFavorite(
                          offer
                        )
                      }
                      disabled={
                        removingId ===
                        Number(offerId)
                      }
                      title="Retirer des favoris"
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EAFBFC]
                        text-[#08B7C9]
                        transition
                        hover:bg-red-50
                        hover:text-red-500
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {removingId ===
                      Number(offerId)
                        ? "…"
                        : "♥"}
                    </button>

                  </div>

                  {/* =================================================
                      BADGES
                  ================================================= */}

                  <div
                    className="
                      mt-4
                      flex
                      flex-wrap
                      gap-1.5
                    "
                  >

                    {timing && (
                      <Badge tone={timing.tone}>
                        {timing.label}
                      </Badge>
                    )}

                    <Badge tone={meta.tone}>
                      {meta.label}
                    </Badge>

                  </div>

                  {/* =================================================
                      TITLE
                  ================================================= */}

                  <h2
                    className="
                      mt-5
                      line-clamp-2
                      min-h-[48px]
                      text-lg
                      font-bold
                      leading-6
                      text-[#123F4B]
                      transition-colors
                      group-hover:text-[#08B7C9]
                    "
                  >
                    {offer.titre ||
                      "Offre de stage"}
                  </h2>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <p
                    className="
                      mt-3
                      line-clamp-3
                      text-xs
                      leading-5
                      text-[#6f8187]
                    "
                  >
                    {offer.description ||
                      "Aucune description disponible."}
                  </p>

                  {/* =================================================
                      COMPETENCES
                  ================================================= */}

                  {competences.length > 0 && (
                    <div className="mt-4">

                      <p
                        className="
                          mb-2
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.13em]
                          text-[#94A4A9]
                        "
                      >
                        Compétences
                      </p>

                      <div className="flex flex-wrap gap-1.5">

                        {competences
                          .slice(0, 4)
                          .map(
                            (
                              competence,
                              index
                            ) => (
                              <span
                                key={`${competence}-${index}`}
                                className="
                                  rounded-md
                                  border
                                  border-[#d8f1f3]
                                  bg-[#EAFBFC]
                                  px-2
                                  py-1
                                  text-[9px]
                                  font-medium
                                  text-[#08B7C9]
                                "
                              >
                                {competence}
                              </span>
                            )
                          )}

                        {competences.length >
                          4 && (
                          <span
                            className="
                              rounded-md
                              bg-[#f4f7f8]
                              px-2
                              py-1
                              text-[9px]
                              font-medium
                              text-[#819399]
                            "
                          >
                            +{competences.length - 4}
                          </span>
                        )}

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      DATE
                  ================================================= */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                      border-t
                      border-[#edf2f3]
                      pt-4
                    "
                  >

                    <IconCalendar
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-[#08B7C9]
                      "
                    />

                    <p
                      className="
                        text-[10px]
                        text-[#819399]
                      "
                    >
                      Du{" "}

                      <span
                        className="
                          font-semibold
                          text-[#526970]
                        "
                      >
                        {formatDate(
                          offer.date_debut
                        )}
                      </span>

                      {" "}au{" "}

                      <span
                        className="
                          font-semibold
                          text-[#526970]
                        "
                      >
                        {formatDate(
                          offer.date_fin
                        )}
                      </span>
                    </p>

                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================= */}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      gap-2
                    "
                  >

                    {/* DETAILS */}

                    <button
                      type="button"
                      onClick={() =>
                        handleViewOffer(
                          offer
                        )
                      }
                      className="
                        flex-1
                        rounded-xl
                        border
                        border-[#dceff1]
                        bg-white
                        px-3
                        py-2.5
                        text-[10px]
                        font-bold
                        text-[#526970]
                        transition
                        hover:border-[#08B7C9]
                        hover:bg-[#EAFBFC]
                        hover:text-[#08B7C9]
                      "
                    >
                      Voir l'offre
                    </button>

                    {/* APPLY */}

                    <button
                      type="button"
                      onClick={() =>
                        handleApply(
                          offer
                        )
                      }
                      className="
                        flex-1
                        rounded-xl
                        bg-[#08B7C9]
                        px-3
                        py-2.5
                        text-[10px]
                        font-bold
                        text-white
                        shadow-sm
                        shadow-[#08B7C9]/20
                        transition
                        hover:bg-[#079eae]
                      "
                    >
                      <span className="inline-flex items-center gap-1.5">

                        <IconBriefcase className="h-3 w-3" />

                        Postuler

                      </span>
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      </div>
    </section>
  );
}