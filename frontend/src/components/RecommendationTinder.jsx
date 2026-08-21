import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import Avatar from "./ui/Avatar";
import Badge from "./ui/Badge";
import {
  IconBriefcase,
  IconBuilding,
  IconCalendar,
  IconMessageCircle,
} from "./ui/Icons";

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
      label: days <= 1 ? "Débute demain" : `Débute dans ${days} j`,
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
   HELPERS
========================================================= */

function getOfferId(offer) {
  return (
    offer?.offer_id ??
    offer?.offerId ??
    offer?.internship_offer_id ??
    offer?.internshipOfferId ??
    offer?.offer?.id ??
    null
  );
}

function getCompanyId(offer) {
  return (
    offer?.company_id ??
    offer?.companyId ??
    offer?.company?.id ??
    null
  );
}

function getValidationMessage(error, fallback) {
  const responseData = error?.response?.data;
  const validationErrors = responseData?.errors;

  if (
    validationErrors &&
    typeof validationErrors === "object"
  ) {
    const firstError = Object.values(validationErrors)?.[0];

    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0];
    }
  }

  return responseData?.message || fallback;
}

function normalizeScore(value) {
  return Math.max(
    0,
    Math.min(100, Number(value) || 0)
  );
}

function normalizeRecommendation(item) {
  return {
    ...item,

    company_id:
      item.company_id ??
      item.companyId ??
      item.company?.id ??
      null,

    offer_id:
      item.offer_id ??
      item.offerId ??
      item.internship_offer_id ??
      item.internshipOfferId ??
      item.offer?.id ??
      item.id ??
      null,

    score: normalizeScore(item.score),

    is_favorite: Boolean(
      item.is_favorite ??
        item.isFavorite ??
        false
    ),
  };
}

function normalizeRecommendations(data) {
  return data
    .map(normalizeRecommendation)
    .filter((item) => item.offer_id)
    .sort((a, b) => b.score - a.score);
}

function getCompetences(value) {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return [];
}

function getTypeMeta(type) {
  return (
    TYPE_META[type] || {
      label: type || "Stage",
      tone: "neutral",
    }
  );
}

function getSwipeMessage(type) {
  return type === "like"
    ? {
        message: "Offre ajoutée à vos favoris.",
        tone: "success",
      }
    : {
        message: "Offre passée.",
        tone: "info",
      };
}

function getSwipeClass(direction) {
  if (direction === "like") {
    return "translate-x-[110%] rotate-[4deg] opacity-0";
  }

  if (direction === "pass") {
    return "-translate-x-[110%] -rotate-[4deg] opacity-0";
  }

  return "";
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <section className="w-full">
      <div className="mb-6">
        <div className="h-3 w-28 animate-pulse rounded bg-[#e4edef]" />
        <div className="mt-2 h-6 w-64 animate-pulse rounded bg-[#e4edef]" />
        <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-[#e4edef]" />
      </div>

      <div className="h-[520px] w-full animate-pulse bg-[#f5f7f8]" />
    </section>
  );
}

/* =========================================================
   ERROR STATE
========================================================= */

function ErrorState({ error }) {
  return (
    <section className="w-full">
      <div className="py-5">
        <p className="text-sm font-semibold text-red-700">
          Recommandations IA
        </p>

        <p className="mt-1 text-xs leading-5 text-red-600">
          {error}
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onReset }) {
  return (
    <section className="w-full">
      <div className="py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAFBFC] text-[#08B7C9]">
          <IconBriefcase className="h-5 w-5" />
        </div>

        <p className="mt-4 text-sm font-bold text-[#123F4B]">
          Vous avez parcouru toutes les recommandations
        </p>

        <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#819399]">
          L'IA n'a plus d'offre recommandée à vous
          présenter pour le moment.
        </p>

        <button
          type="button"
          onClick={onReset}
          className="
            mt-5
            rounded-lg
            bg-[#08B7C9]
            px-4
            py-2.5
            text-xs
            font-semibold
            text-white
            transition
            hover:bg-[#079eae]
          "
        >
          Revoir les recommandations
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   OFFER HEADER
========================================================= */

function OfferHeader({ offer, timing, meta }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar
          name={offer.entreprise || "Entreprise"}
          square
          size="md"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#123F4B]">
            {offer.entreprise || "Entreprise"}
          </p>

          <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#94A4A9]">
            <IconBuilding className="h-3 w-3" />
            Entreprise
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-1.5">
        {timing && (
          <Badge tone={timing.tone}>
            {timing.label}
          </Badge>
        )}

        <Badge tone={meta.tone}>
          {meta.label}
        </Badge>
      </div>
    </div>
  );
}

/* =========================================================
   SCORE
========================================================= */

function ScoreSection({ score }) {
  return (
    <div className="mt-6 flex flex-col gap-4 border-y border-[#dceff1] py-5 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 border-[#08B7C9] bg-[#EAFBFC]">
        <span className="text-lg font-bold leading-none text-[#08B7C9]">
          {score}%
        </span>

        <span className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-[#819399]">
          Match
        </span>
      </div>

      <div>
        <p className="text-sm font-bold text-[#123F4B]">
          Compatibilité
        </p>

        <p className="mt-1 text-xs leading-5 text-[#819399]">
          Cette offre correspond fortement
          à votre profil selon l'analyse IA.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   COMPETENCES
========================================================= */

function CompetencesSection({ competences }) {
  if (competences.length === 0) {
    return null;
  }

  return (
    <div className="mt-7">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A4A9]">
        Compétences recherchées
      </p>

      <div className="flex flex-wrap gap-1.5">
        {competences.map((competence, index) => (
          <span
            key={`${competence}-${index}`}
            className="
              rounded-md
              border
              border-[#d8f1f3]
              bg-[#EAFBFC]
              px-2.5
              py-1.5
              text-[10px]
              font-medium
              text-[#08B7C9]
            "
          >
            {competence}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   REASON
========================================================= */

function ReasonSection({ reason }) {
  if (!reason) {
    return null;
  }

  return (
    <div className="mt-7 border-l-2 border-[#08B7C9] pl-4">
      <div className="flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAFBFC] text-[#08B7C9]">
          ✦
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-[#123F4B]">
            Pourquoi cette recommandation ?
          </p>

          <p className="mt-1.5 text-xs leading-5 text-[#526970]">
            {reason}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   OFFER DATES
========================================================= */

function OfferDates({ startDate, endDate }) {
  return (
    <div className="mt-7 flex items-center gap-2 border-t border-[#edf2f3] pt-5">
      <IconCalendar className="h-4 w-4 text-[#08B7C9]" />

      <p className="text-xs text-[#819399]">
        Du{" "}
        <span className="font-semibold text-[#526970]">
          {formatDate(startDate)}
        </span>
        {" "}au{" "}
        <span className="font-semibold text-[#526970]">
          {formatDate(endDate)}
        </span>
      </p>
    </div>
  );
}

/* =========================================================
   OFFER CONTENT
========================================================= */

function OfferContent({ offer }) {
  const meta = getTypeMeta(offer.type);
  const timing = getTiming(
    offer.date_debut,
    offer.date_fin
  );

  const competences = getCompetences(
    offer.competences_requises
  );

  return (
    <div className="py-6">
      <OfferHeader
        offer={offer}
        timing={timing}
        meta={meta}
      />

      <div className="mt-7">
        <h3 className="text-2xl font-bold leading-tight tracking-tight text-[#123F4B] md:text-[28px]">
          {offer.titre}
        </h3>
      </div>

      <ScoreSection score={offer.score} />

      <div className="mt-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#94A4A9]">
          À propos de l'offre
        </p>

        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#526970]">
          {offer.description ||
            "Aucune description disponible."}
        </p>
      </div>

      <CompetencesSection
        competences={competences}
      />

      <ReasonSection reason={offer.raison} />

      <OfferDates
        startDate={offer.date_debut}
        endDate={offer.date_fin}
      />
    </div>
  );
}

/* =========================================================
   ACTION BUTTONS
========================================================= */

function ActionButtons({
  currentOffer,
  animating,
  applying,
  favoriting,
  onSwipe,
  onApply,
  onFavorite,
  onContact,
}) {
  const disabled =
    animating || applying || favoriting;

  const favoriteDisabled =
    disabled || currentOffer.is_favorite;

  const favoriteTitle = currentOffer.is_favorite
    ? "Déjà dans vos favoris"
    : "Ajouter aux favoris";

  const favoriteClasses = currentOffer.is_favorite
    ? "border-[#08B7C9] bg-[#EAFBFC] text-[#08B7C9]"
    : "border-[#bde9df] bg-[#effbf8] text-[#22C55E] hover:bg-[#dcf8f0]";

  const favoriteContent = favoriting
    ? "…"
    : "♥";

  return (
    <div className="border-t border-[#e4edef] py-5">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSwipe("pass")}
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-[#e4edef]
            bg-white
            text-lg
            text-[#819399]
            shadow-sm
            transition
            hover:-translate-y-1
            hover:border-red-200
            hover:bg-red-50
            hover:text-red-500
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          title="Passer"
        >
          ✕
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onApply(currentOffer)}
          className="
            flex
            h-11
            min-w-[120px]
            items-center
            justify-center
            gap-2
            rounded-full
            bg-[#08B7C9]
            px-6
            text-[11px]
            font-bold
            text-white
            shadow-md
            shadow-[#08B7C9]/20
            transition
            hover:-translate-y-0.5
            hover:bg-[#079eae]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <IconBriefcase className="h-3.5 w-3.5" />
          {applying ? "Envoi..." : "Postuler"}
        </button>

        <button
          type="button"
          disabled={favoriteDisabled}
          onClick={() => onFavorite(currentOffer)}
          className={`
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            shadow-sm
            transition
            hover:-translate-y-1
            disabled:cursor-not-allowed
            disabled:opacity-50
            ${favoriteClasses}
          `}
          title={favoriteTitle}
        >
          {favoriteContent}
        </button>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onContact}
        className="
          mx-auto
          mt-3
          flex
          items-center
          gap-1.5
          rounded-lg
          px-3
          py-1.5
          text-[10px]
          font-semibold
          text-[#08B7C9]
          transition
          hover:bg-[#EAFBFC]
          disabled:opacity-50
        "
      >
        <IconMessageCircle className="h-3 w-3" />
        Contacter l'entreprise
      </button>

      <p className="mt-2 text-center text-[9px] text-[#b0bdc1]">
        ← Passer&nbsp;&nbsp;&nbsp; → J'aime
      </p>
    </div>
  );
}

/* =========================================================
   OFFER CARD
========================================================= */

function OfferCard({
  currentOffer,
  direction,
  animating,
  applying,
  favoriting,
  onSwipe,
  onApply,
  onFavorite,
  onContact,
}) {
  const swipeClass = getSwipeClass(direction);

  return (
    <div
      className={`
        w-full
        transition-all
        duration-300
        ${swipeClass}
      `}
    >
      <div className="h-1 w-full rounded-full bg-[#08B7C9]" />

      <OfferContent offer={currentOffer} />

      <ActionButtons
        currentOffer={currentOffer}
        animating={animating}
        applying={applying}
        favoriting={favoriting}
        onSwipe={onSwipe}
        onApply={onApply}
        onFavorite={onFavorite}
        onContact={onContact}
      />
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function RecommendationTinder({
  studentId,
  onApply,
}) {
  const { notify } = useToast();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] =
    useState([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [direction, setDirection] =
    useState(null);

  const [animating, setAnimating] =
    useState(false);

  const [applying, setApplying] =
    useState(false);

  const [favoriting, setFavoriting] =
    useState(false);

  /* =======================================================
     LOAD RECOMMENDATIONS
  ======================================================= */

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      setRecommendations([]);
      return;
    }

    let mounted = true;

    const loadRecommendations =
      async () => {
        setLoading(true);
        setError("");

        try {
          const response =
            await api.get(
              `/students/${studentId}/recommendations`
            );

          if (!mounted) {
            return;
          }

          const data =
            response?.data?.recommendations ??
            [];

          console.log(
            "Recommandations reçues :",
            data
          );

          const normalized =
            normalizeRecommendations(data);

          console.log(
            "Recommandations normalisées :",
            normalized
          );

          setRecommendations(normalized);
          setCurrentIndex(0);
        } catch (err) {
          console.error(
            "Erreur recommandations IA :",
            err?.response?.data || err
          );

          if (!mounted) {
            return;
          }

          setError(
            err?.response?.data?.message ||
              "Impossible de charger les recommandations IA."
          );
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadRecommendations();

    return () => {
      mounted = false;
    };
  }, [studentId]);

  /* =======================================================
     CURRENT OFFER
  ======================================================= */

  const currentOffer =
    recommendations[currentIndex] || null;

  const remaining =
    recommendations.length - currentIndex;

  /* =======================================================
     NEXT
  ======================================================= */

  const goNext = () => {
    setDirection(null);
    setAnimating(false);
    setCurrentIndex(
      (index) => index + 1
    );
  };

  /* =======================================================
     SWIPE
  ======================================================= */

  const handleSwipe = (type) => {
    if (
      animating ||
      applying ||
      favoriting ||
      !currentOffer
    ) {
      return;
    }

    setDirection(type);
    setAnimating(true);

    window.setTimeout(() => {
      const result =
        getSwipeMessage(type);

      notify(
        result.message,
        result.tone
      );

      goNext();
    }, 300);
  };

  /* =======================================================
     FAVORITE
  ======================================================= */

  const handleFavorite =
    async (offer) => {
      if (
        !offer ||
        favoriting ||
        animating ||
        applying
      ) {
        return;
      }

      const offerId =
        getOfferId(offer);

      if (!offerId) {
        console.error(
          "offer_id absent :",
          offer
        );

        notify(
          "Impossible d'ajouter cette offre aux favoris.",
          "error"
        );

        return;
      }

      setFavoriting(true);

      try {
        const payload = {
          internship_offer_id:
            Number(offerId),
        };

        console.log(
          "Ajout favori - payload :",
          payload
        );

        const response =
          await api.post(
            "/favorites",
            payload
          );

        console.log(
          "Favori créé :",
          response.data
        );

        setRecommendations(
          (previous) =>
            previous.map((item) =>
              item.offer_id ===
              Number(offerId)
                ? {
                    ...item,
                    is_favorite: true,
                  }
                : item
            )
        );

        setDirection("like");
        setAnimating(true);

        window.setTimeout(() => {
          notify(
            response?.data?.message ||
              "Offre ajoutée à vos favoris.",
            "success"
          );

          goNext();
        }, 300);
      } catch (err) {
        console.error(
          "Erreur ajout favori :",
          err?.response?.data || err
        );

        notify(
          getValidationMessage(
            err,
            "Impossible d'ajouter cette offre aux favoris."
          ),
          "error"
        );
      } finally {
        setFavoriting(false);
      }
    };

  /* =======================================================
     KEYBOARD
  ======================================================= */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          !currentOffer ||
          animating ||
          applying ||
          favoriting
        ) {
          return;
        }

        if (
          event.key === "ArrowLeft"
        ) {
          handleSwipe("pass");
        }

        if (
          event.key === "ArrowRight"
        ) {
          handleFavorite(
            currentOffer
          );
        }
      };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    currentOffer,
    animating,
    applying,
    favoriting,
  ]);

  /* =======================================================
     APPLY
  ======================================================= */

  const handleApply =
    async (offer) => {
      if (!offer) {
        return;
      }

      const offerId =
        getOfferId(offer);

      if (!offerId) {
        console.error(
          "offer_id absent :",
          offer
        );

        notify(
          "Impossible de postuler : l'identifiant de l'offre est manquant.",
          "error"
        );

        return;
      }

      if (
        applying ||
        animating ||
        favoriting
      ) {
        return;
      }

      setApplying(true);

      try {
        const payload = {
          internship_offer_id:
            Number(offerId),
        };

        console.log(
          "Candidature - payload :",
          payload
        );

        const response =
          await api.post(
            "/applications",
            payload
          );

        console.log(
          "Candidature créée :",
          response.data
        );

        notify(
          response?.data?.message ||
            "Votre candidature a été envoyée avec succès.",
          "success"
        );

        if (
          typeof onApply ===
          "function"
        ) {
          onApply(offer);
        }
      } catch (err) {
        console.error(
          "Erreur candidature :",
          err?.response?.data || err
        );

        notify(
          getValidationMessage(
            err,
            "Impossible d'envoyer votre candidature."
          ),
          "error"
        );
      } finally {
        setApplying(false);
      }
    };

  /* =======================================================
     CONVERSATION
  ======================================================= */

  const startConversation =
    async () => {
      if (
        !currentOffer ||
        animating ||
        applying ||
        favoriting
      ) {
        return;
      }

      const companyId =
        getCompanyId(currentOffer);

      const offerId =
        getOfferId(currentOffer);

      console.log(
        "Conversation - currentOffer :",
        currentOffer
      );

      console.log(
        "Conversation - company_id :",
        companyId
      );

      console.log(
        "Conversation - internship_offer_id :",
        offerId
      );

      if (!companyId) {
        console.error(
          "company_id absent dans la recommandation :",
          currentOffer
        );

        notify(
          "Impossible de contacter l'entreprise : l'identifiant de l'entreprise est manquant.",
          "error"
        );

        return;
      }

      try {
        const payload = {
          company_id:
            Number(companyId),
        };

        if (offerId) {
          payload.internship_offer_id =
            Number(offerId);
        }

        console.log(
          "Payload envoyé à /conversations :",
          payload
        );

        const response =
          await api.post(
            "/conversations",
            payload
          );

        console.log(
          "Conversation créée :",
          response.data
        );

        navigate(
          `/messages?conversation=${response.data.id}`
        );
      } catch (err) {
        console.error(
          "Erreur conversation :",
          err?.response?.data || err
        );

        notify(
          err?.response?.data?.message ||
            "Impossible de démarrer la conversation.",
          "error"
        );
      }
    };

  /* =======================================================
     RENDER STATES
  ======================================================= */

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!currentOffer) {
    return (
      <EmptyState
        onReset={() => {
          setCurrentIndex(0);
        }}
      />
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="w-full">
      {/* HEADER */}
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#EAFBFC] text-[#08B7C9]">
              ✨
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#08B7C9]">
              Recommandations IA
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-[#123F4B]">
            Des offres sélectionnées pour vous
          </h2>

          <p className="mt-1 text-xs text-[#819399]">
            Basées sur votre profil, vos compétences
            et vos préférences.
          </p>
        </div>

        <div className="text-[10px] font-semibold text-[#94A4A9]">
          {currentIndex + 1} /{" "}
          {recommendations.length}
        </div>
      </div>

      {/* OFFER */}
      <OfferCard
        currentOffer={currentOffer}
        direction={direction}
        animating={animating}
        applying={applying}
        favoriting={favoriting}
        onSwipe={handleSwipe}
        onApply={handleApply}
        onFavorite={handleFavorite}
        onContact={startConversation}
      />

      {/* PROGRESS */}
      <div className="mt-5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e9eff0]">
          <div
            className="h-full rounded-full bg-[#08B7C9] transition-all duration-500"
            style={{
              width: `${
                ((currentIndex + 1) /
                  recommendations.length) *
                100
              }%`,
            }}
          />
        </div>

        <span className="shrink-0 text-[9px] font-semibold text-[#94A4A9]">
          {remaining}{" "}
          {remaining > 1
            ? "offres restantes"
            : "offre restante"}
        </span>
      </div>
    </section>
  );
}
