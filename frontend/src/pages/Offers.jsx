import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonOfferCard } from "../components/ui/Skeleton";
import Avatar from "../components/ui/Avatar";

import {
  IconSearch,
  IconCalendar,
  IconBuilding,
  IconInbox,
  IconUpload,
  IconFile,
  IconX,
  IconBriefcase,
  IconMessageCircle,
} from "../components/ui/Icons";

/* =========================================================
   CONSTANTS
========================================================= */

const COLORS = {
  primary: "#08B7C9",
  primaryDark: "#123F4B",
  background: "#f5f7f8",
  border: "#e4edef",
  muted: "#819399",
};

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
   DATE HELPERS
========================================================= */

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value) {
  if (!value) {
    return "Date non renseignée";
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : dateFormatter.format(date);
}

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
      (start - now) / 86400000
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
   STEP ICON
========================================================= */

function StepIcon({ number, active, completed }) {
  return (
    <div
      className={`
        relative flex h-8 w-8 shrink-0 items-center justify-center
        rounded-full text-[11px] font-bold
        transition-all duration-300
        ${
          completed
            ? "bg-[#08B7C9] text-white shadow-sm shadow-[#08B7C9]/20"
            : active
            ? "bg-[#08B7C9] text-white ring-4 ring-[#EAFBFC]"
            : "border border-[#dce7e9] bg-white text-[#94A4A9]"
        }
      `}
    >
      {completed ? "✓" : number}
    </div>
  );
}

/* =========================================================
   APPLY MODAL
========================================================= */

function ApplyModal({
  offer,
  user,
  onClose,
  onSubmitted,
}) {
  const { notify } = useToast();
  const dialogRef = useRef(null);

  const [step, setStep] = useState(1);

  const [cvFile, setCvFile] = useState(null);
  const [lettreFile, setLettreFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    telephone: user?.student?.telephone || "",
    filiere: user?.student?.filiere || "",
    niveau: user?.student?.niveau || "",
    adresse: "",
    message: "",
  });

  const steps = [
    {
      number: 1,
      label: "Profil",
      description: "Vos coordonnées",
    },
    {
      number: 2,
      label: "Formation",
      description: "Votre parcours",
    },
    {
      number: 3,
      label: "Motivation",
      description: "Votre message",
    },
    {
      number: 4,
      label: "Documents",
      description: "CV et lettre",
    },
    {
      number: 5,
      label: "Vérification",
      description: "Dernière étape",
    },
  ];

  /* =======================================================
     MODAL EFFECTS
  ======================================================= */

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, submitting]);

  /* =======================================================
     PROFILE CHANGE
  ======================================================= */

  const updateProfile = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateStep = () => {
    setError("");

    if (step === 1) {
      if (!profile.telephone.trim()) {
        setError(
          "Veuillez renseigner votre numéro de téléphone."
        );

        return false;
      }
    }

    if (step === 2) {
      if (!profile.filiere.trim()) {
        setError(
          "Veuillez renseigner votre filière."
        );

        return false;
      }

      if (!profile.niveau.trim()) {
        setError(
          "Veuillez renseigner votre niveau."
        );

        return false;
      }
    }

    if (step === 4) {
      if (!cvFile) {
        setError(
          "Le CV est obligatoire pour continuer."
        );

        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (step < 5) {
      setStep((current) => current + 1);
    }
  };

  const previousStep = () => {
    setError("");

    if (step > 1) {
      setStep((current) => current - 1);
    }
  };

  /* =======================================================
     SUBMIT APPLICATION
  ======================================================= */

  const handleSubmit = async () => {
    if (!cvFile) {
      setError("Le CV est obligatoire.");
      setStep(4);

      return;
    }

    if (!offer?.id) {
      setError(
        "Impossible d'identifier cette offre."
      );

      return;
    }

    setSubmitting(true);
    setError("");

    try {
      /* ---------------------------------------------------
         UPDATE STUDENT PROFILE
      --------------------------------------------------- */

      if (user?.student?.id) {
        await api.put(
          `/students/${user.student.id}`,
          {
            telephone: profile.telephone,
            filiere: profile.filiere,
            niveau: profile.niveau,
          }
        );
      }

      /* ---------------------------------------------------
         APPLICATION FORM DATA
      --------------------------------------------------- */

      const data = new FormData();

      data.append(
        "internship_offer_id",
        offer.id
      );

      data.append("cv", cvFile);

      if (lettreFile) {
        data.append(
          "lettre_motivation",
          lettreFile
        );
      }

      if (profile.message.trim()) {
        data.append(
          "message",
          profile.message.trim()
        );
      }

      /* ---------------------------------------------------
         SEND APPLICATION
      --------------------------------------------------- */

      await api.post(
        "/applications",
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      notify(
        "Candidature envoyée avec succès.",
        "success"
      );

      onSubmitted();
    } catch (err) {
      console.error(
        "Erreur candidature :",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Impossible d'envoyer la candidature. Vérifiez vos informations et vos documents."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =======================================================
     MODAL
  ======================================================= */

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-[#123F4B]/55
        p-3 sm:p-5
        backdrop-blur-md
      "
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submitting
        ) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="apply-modal-title"
        className="
          flex w-full max-w-3xl
          max-h-[94vh]
          flex-col
          overflow-hidden
          rounded-2xl
          border border-[#e4edef]
          bg-white
          shadow-[0_25px_80px_rgba(18,63,75,0.18)]
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="border-b border-[#e4edef] bg-white">
          <div className="flex items-center justify-between px-5 py-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-[#EAFBFC]
                  text-[#08B7C9]
                "
              >
                <IconBriefcase className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#08B7C9]">
                  Candidature
                </p>

                <h2
                  id="apply-modal-title"
                  className="truncate text-sm font-semibold text-[#123F4B]"
                >
                  {offer?.titre ||
                    "Nouvelle candidature"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-lg
                text-[#94A4A9]
                transition
                hover:bg-[#f5f7f8]
                hover:text-[#123F4B]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
              aria-label="Fermer"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>

          {/* STEPPER */}

          <div className="px-5 pb-5 sm:px-6">
            <div className="relative">
              <div className="absolute left-4 right-4 top-4 h-px bg-[#e4edef]" />

              <div
                className="
                  absolute
                  left-4 top-4
                  h-px
                  bg-[#08B7C9]
                  transition-all duration-500
                "
                style={{
                  width: `${((step - 1) / 4) * 100}%`,
                  maxWidth:
                    "calc(100% - 32px)",
                }}
              />

              <div className="relative flex justify-between">
                {steps.map((item) => {
                  const active =
                    step === item.number;

                  const completed =
                    step > item.number;

                  return (
                    <div
                      key={item.number}
                      className="flex flex-col items-center"
                    >
                      <StepIcon
                        number={item.number}
                        active={active}
                        completed={completed}
                      />

                      <span
                        className={`
                          mt-2 text-[10px] font-semibold
                          ${
                            active || completed
                              ? "text-[#123F4B]"
                              : "text-[#94A4A9]"
                          }
                        `}
                      >
                        {item.label}
                      </span>

                      <span className="hidden text-[9px] text-[#94A4A9] sm:block">
                        {item.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-[#f5f7f8]/70">
          <div className="mx-auto max-w-2xl px-5 py-6 sm:px-8">
            {/* ERROR */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                  !
                </div>

                <p className="text-xs leading-5 text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setError("")}
                  className="ml-auto text-red-400 hover:text-red-600"
                  aria-label="Fermer l'erreur"
                >
                  <IconX className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* =================================================
                STEP 1
            ================================================= */}

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <StepHeader
                  eyebrow="01 / 05"
                  title="Commençons par votre profil"
                  description="Vérifiez vos coordonnées avant de continuer."
                />

                <div className="mt-6 space-y-4">
                  <InfoRow
                    label="Nom complet"
                    value={
                      user?.name ||
                      "Non renseigné"
                    }
                    disabled
                  />

                  <InfoRow
                    label="Adresse e-mail"
                    value={
                      user?.email ||
                      "Non renseignée"
                    }
                    disabled
                  />

                  <InputField
                    label="Téléphone"
                    value={profile.telephone}
                    placeholder="06 00 00 00 00"
                    onChange={(value) =>
                      updateProfile(
                        "telephone",
                        value
                      )
                    }
                    required
                  />

                  <InputField
                    label="Adresse"
                    value={profile.adresse}
                    placeholder="Ville, quartier..."
                    onChange={(value) =>
                      updateProfile(
                        "adresse",
                        value
                      )
                    }
                    optional
                  />
                </div>
              </div>
            )}

            {/* =================================================
                STEP 2
            ================================================= */}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <StepHeader
                  eyebrow="02 / 05"
                  title="Votre formation"
                  description="Ces informations permettent à l'entreprise de mieux comprendre votre profil."
                />

                <div className="mt-6 space-y-4">
                  <InputField
                    label="Filière"
                    value={profile.filiere}
                    placeholder="Ex. Réseaux et Systèmes d'Information"
                    onChange={(value) =>
                      updateProfile(
                        "filiere",
                        value
                      )
                    }
                    required
                  />

                  <InputField
                    label="Niveau d'études"
                    value={profile.niveau}
                    placeholder="Ex. Master 2"
                    onChange={(value) =>
                      updateProfile(
                        "niveau",
                        value
                      )
                    }
                    required
                  />

                  <div className="rounded-xl border border-[#cfeef1] bg-[#EAFBFC]/70 p-4">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#08B7C9] shadow-sm">
                        <span className="text-xs font-bold">
                          i
                        </span>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-[#123F4B]">
                          Pourquoi ces informations ?
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-[#526970]">
                          Elles permettent de
                          présenter un profil de
                          candidature plus complet
                          à l'entreprise.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 3
            ================================================= */}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <StepHeader
                  eyebrow="03 / 05"
                  title="Présentez votre motivation"
                  description="Un court message peut aider votre candidature à se démarquer."
                />

                <div className="mt-6">
                  <label
                    htmlFor="apply-message"
                    className="mb-2 block text-xs font-semibold text-[#123F4B]"
                  >
                    Message à l'entreprise

                    <span className="ml-1 font-normal text-[#94A4A9]">
                      (optionnel)
                    </span>
                  </label>

                  <textarea
                    id="apply-message"
                    value={profile.message}
                    maxLength={500}
                    onChange={(event) =>
                      updateProfile(
                        "message",
                        event.target.value
                      )
                    }
                    placeholder="Expliquez brièvement pourquoi cette offre vous intéresse et ce que vous pourriez apporter..."
                    className="
                      min-h-[180px]
                      w-full
                      resize-none
                      rounded-xl
                      border border-[#e4edef]
                      bg-white
                      px-4 py-3
                      text-xs
                      leading-6
                      text-[#123F4B]
                      outline-none
                      transition
                      placeholder:text-[#94A4A9]
                      focus:border-[#08B7C9]
                      focus:ring-4
                      focus:ring-[#EAFBFC]
                    "
                  />

                  <div className="mt-2 flex justify-between">
                    <span className="text-[10px] text-[#94A4A9]">
                      Soyez clair et professionnel.
                    </span>

                    <span className="text-[10px] text-[#94A4A9]">
                      {profile.message.length}/500
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-[#cfeef1] bg-[#EAFBFC]/70 p-4">
                  <p className="text-xs font-semibold text-[#123F4B]">
                    Conseil
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#526970]">
                    Mentionnez votre intérêt pour
                    le domaine, vos compétences
                    principales et pourquoi vous
                    souhaitez rejoindre cette
                    entreprise.
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                STEP 4
            ================================================= */}

            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <StepHeader
                  eyebrow="04 / 05"
                  title="Ajoutez vos documents"
                  description="Votre CV est obligatoire. La lettre de motivation reste facultative."
                />

                <div className="mt-6 space-y-4">
                  <DocumentUpload
                    label="CV"
                    description="PDF uniquement · obligatoire"
                    file={cvFile}
                    required
                    onChange={setCvFile}
                  />

                  <DocumentUpload
                    label="Lettre de motivation"
                    description="PDF uniquement · facultatif"
                    file={lettreFile}
                    onChange={setLettreFile}
                  />
                </div>
              </div>
            )}

            {/* =================================================
                STEP 5
            ================================================= */}

            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300">
                <StepHeader
                  eyebrow="05 / 05"
                  title="Vérifiez votre candidature"
                  description="Tout est prêt ? Vérifiez les informations avant l'envoi."
                />

                <div className="mt-6 space-y-3">
                  <ReviewCard
                    number="01"
                    title="Profil"
                    onEdit={() => setStep(1)}
                  >
                    <p>
                      <strong>
                        {user?.name ||
                          "Nom non renseigné"}
                      </strong>
                    </p>

                    <p>
                      {user?.email ||
                        "Email non renseigné"}
                    </p>

                    <p>
                      {profile.telephone}
                    </p>

                    {profile.adresse && (
                      <p>
                        {profile.adresse}
                      </p>
                    )}
                  </ReviewCard>

                  <ReviewCard
                    number="02"
                    title="Formation"
                    onEdit={() => setStep(2)}
                  >
                    <p>
                      {profile.filiere}
                    </p>

                    <p>
                      {profile.niveau}
                    </p>
                  </ReviewCard>

                  <ReviewCard
                    number="03"
                    title="Motivation"
                    onEdit={() => setStep(3)}
                  >
                    <p className="line-clamp-3">
                      {profile.message ||
                        "Aucun message ajouté."}
                    </p>
                  </ReviewCard>

                  <ReviewCard
                    number="04"
                    title="Documents"
                    onEdit={() => setStep(4)}
                  >
                    <div className="space-y-1">
                      <DocumentStatus
                        name="CV"
                        file={cvFile}
                        required
                      />

                      <DocumentStatus
                        name="Lettre de motivation"
                        file={lettreFile}
                      />
                    </div>
                  </ReviewCard>
                </div>

                <div className="mt-5 rounded-xl border border-[#bde9df] bg-[#effbf8] p-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white">
                      <span className="text-xs">
                        ✓
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#123F4B]">
                        Prêt à envoyer
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-[#526970]">
                        Votre candidature sera
                        transmise à l'entreprise
                        pour cette offre.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="flex items-center justify-between border-t border-[#e4edef] bg-white px-5 py-4 sm:px-6">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={previousStep}
                disabled={submitting}
                className="
                  rounded-lg
                  px-3 py-2
                  text-xs font-semibold
                  text-[#526970]
                  transition
                  hover:bg-[#EAFBFC]
                  hover:text-[#123F4B]
                  disabled:opacity-50
                "
              >
                ← Précédent
              </button>
            )}

            {step === 1 && (
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="
                  rounded-lg
                  px-3 py-2
                  text-xs font-semibold
                  text-[#526970]
                  transition
                  hover:bg-[#EAFBFC]
                  hover:text-[#123F4B]
                  disabled:opacity-50
                "
              >
                Annuler
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] text-[#94A4A9] sm:block">
              Étape {step} sur 5
            </span>

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#08B7C9]
                  px-4 py-2.5
                  text-xs
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#079eae]
                  hover:shadow-md
                "
              >
                Continuer
                <span>→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#08B7C9]
                  px-4 py-2.5
                  text-xs
                  font-semibold
                  text-white
                  shadow-sm
                  shadow-[#08B7C9]/20
                  transition
                  hover:bg-[#079eae]
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {submitting ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Envoi...
                  </>
                ) : (
                  <>
                    Envoyer ma candidature
                    <span>✓</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STEP HEADER
========================================================= */

function StepHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#08B7C9]">
        {eyebrow}
      </p>

      <h3 className="mt-1.5 text-lg font-bold tracking-tight text-[#123F4B]">
        {title}
      </h3>

      <p className="mt-1.5 max-w-xl text-xs leading-5 text-[#819399]">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  placeholder,
  onChange,
  required,
  optional,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#123F4B]">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

        {optional && (
          <span className="ml-1 font-normal text-[#94A4A9]">
            (optionnel)
          </span>
        )}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          w-full
          rounded-xl
          border border-[#e4edef]
          bg-white
          px-3.5 py-2.5
          text-xs
          text-[#123F4B]
          outline-none
          transition
          placeholder:text-[#94A4A9]
          focus:border-[#08B7C9]
          focus:ring-4
          focus:ring-[#EAFBFC]
        "
      />
    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  label,
  value,
  disabled,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#123F4B]">
        {label}
      </label>

      <div
        className={`
          rounded-xl
          border border-[#e4edef]
          px-3.5 py-2.5
          text-xs
          ${
            disabled
              ? "bg-[#f5f7f8] text-[#819399]"
              : "bg-white text-[#123F4B]"
          }
        `}
      >
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENT UPLOAD
========================================================= */

function DocumentUpload({
  label,
  description,
  file,
  onChange,
  required,
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold text-[#123F4B]">
            {label}

            {required && (
              <span className="ml-1 text-red-500">
                *
              </span>
            )}
          </p>

          <p className="mt-0.5 text-[10px] text-[#94A4A9]">
            {description}
          </p>
        </div>
      </div>

      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-[#cfeef1] bg-[#EAFBFC]/60 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAFBFC] text-[#08B7C9]">
              <IconFile className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-[#123F4B]">
                {file.name}
              </p>

              <p className="mt-0.5 text-[10px] text-[#94A4A9]">
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB · PDF
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange(null)}
            className="
              flex h-7 w-7
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-[#94A4A9]
              transition
              hover:bg-white
              hover:text-red-500
            "
            aria-label={`Supprimer ${label}`}
          >
            <IconX className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label
          className="
            flex
            cursor-pointer
            items-center
            justify-between
            rounded-xl
            border
            border-dashed
            border-[#dce7e9]
            bg-white
            px-4 py-4
            transition
            hover:border-[#08B7C9]
            hover:bg-[#EAFBFC]/30
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f5f7f8] text-[#94A4A9]">
              <IconUpload className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xs font-semibold text-[#123F4B]">
                Sélectionner un fichier
              </p>

              <p className="mt-0.5 text-[10px] text-[#94A4A9]">
                Cliquez pour parcourir vos fichiers
              </p>
            </div>
          </div>

          <span className="rounded-lg border border-[#cfeef1] bg-[#EAFBFC] px-2.5 py-1.5 text-[10px] font-semibold text-[#08B7C9]">
            Parcourir
          </span>

          <input
            type="file"
            accept="application/pdf,.pdf"
            required={required}
            onChange={(event) =>
              onChange(
                event.target.files?.[0] ||
                  null
              )
            }
            className="sr-only"
          />
        </label>
      )}
    </div>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({
  number,
  title,
  children,
  onEdit,
}) {
  return (
    <div className="rounded-xl border border-[#e4edef] bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAFBFC] text-[10px] font-bold text-[#08B7C9]">
          {number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-[#123F4B]">
              {title}
            </p>

            <button
              type="button"
              onClick={onEdit}
              className="text-[10px] font-semibold text-[#08B7C9] hover:text-[#079eae]"
            >
              Modifier
            </button>
          </div>

          <div className="mt-2 space-y-0.5 text-[11px] leading-5 text-[#819399]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENT STATUS
========================================================= */

function DocumentStatus({
  name,
  file,
  required,
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`
          flex h-4 w-4 items-center justify-center
          rounded-full
          text-[8px]
          ${
            file
              ? "bg-[#dcf8f0] text-[#22C55E]"
              : required
              ? "bg-red-100 text-red-600"
              : "bg-[#f5f7f8] text-[#94A4A9]"
          }
        `}
      >
        {file ? "✓" : "–"}
      </span>

      <span className="min-w-0 truncate">
        {name}

        {file && (
          <span className="ml-1 text-[#94A4A9]">
            · {file.name}
          </span>
        )}
      </span>
    </div>
  );
}

/* =========================================================
   AI RECOMMENDATION CARD
========================================================= */

function RecommendationCard({
  recommendation,
  onApply,
  onContact,
}) {
  const score = Math.max(
    0,
    Math.min(
      100,
      Number(
        recommendation?.score ?? 0
      )
    )
  );

  const scoreTone =
    score >= 80
      ? "text-[#16A34A]"
      : score >= 60
      ? "text-[#D97706]"
      : "text-[#819399]";

  const offer = recommendation;

  const meta =
    TYPE_META[offer?.type] ?? {
      label: offer?.type || "Stage",
      tone: "neutral",
    };

  const competences =
    typeof offer?.competences_requises ===
    "string"
      ? offer.competences_requises
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : Array.isArray(
          offer?.competences_requises
        )
      ? offer.competences_requises
      : [];

  const timing = getTiming(
    offer?.date_debut,
    offer?.date_fin
  );

  return (
    <div
      className="
        rounded-2xl
        border border-[#d8eef0]
        bg-white
        p-5
        shadow-[0_4px_20px_rgba(18,63,75,0.055)]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:shadow-[0_10px_30px_rgba(18,63,75,0.09)]
      "
    >
      {/* TOP */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar
            name={
              offer?.entreprise ||
              offer?.company?.nom ||
              "Entreprise"
            }
            square
            size="md"
          />

          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EAFBFC] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#08B7C9]">
                ✨ IA
              </span>

              {timing && (
                <Badge tone={timing.tone}>
                  {timing.label}
                </Badge>
              )}

              <Badge tone={meta.tone}>
                {meta.label}
              </Badge>
            </div>

            <h3 className="text-[15px] font-bold leading-5 text-[#123F4B]">
              {offer?.titre ||
                "Offre recommandée"}
            </h3>

            {(offer?.entreprise ||
              offer?.company?.nom) && (
              <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#819399]">
                <IconBuilding className="h-3 w-3 text-[#08B7C9]" />

                {offer?.entreprise ||
                  offer?.company?.nom}
              </p>
            )}
          </div>
        </div>

        {/* SCORE */}

        <div className="flex shrink-0 flex-col items-center">
          <div
            className={`
              flex h-14 w-14
              items-center justify-center
              rounded-full
              border-4
              border-[#EAFBFC]
              bg-[#f8fcfc]
              ${scoreTone}
            `}
          >
            <span className="text-sm font-bold">
              {score}%
            </span>
          </div>

          <span className="mt-1 text-[9px] font-semibold text-[#94A4A9]">
            Compatibilité
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}

      {offer?.description && (
        <p className="mt-4 line-clamp-2 text-xs leading-5 text-[#819399]">
          {offer.description}
        </p>
      )}

      {/* COMPETENCES */}

      {competences.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {competences
            .slice(0, 8)
            .map((competence, index) => (
              <span
                key={`${competence}-${index}`}
                className="
                  rounded-md
                  border border-[#d8f1f3]
                  bg-[#EAFBFC]
                  px-2 py-1
                  text-[10px]
                  font-medium
                  text-[#08B7C9]
                "
              >
                {competence}
              </span>
            ))}
        </div>
      )}

      {/* WHY */}

      {offer?.raison && (
        <div className="mt-4 rounded-xl border border-[#e8f1f2] bg-[#f8fafb] p-3.5">
          <div className="flex gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#EAFBFC] text-[#08B7C9]">
              <span className="text-[10px] font-bold">
                ✦
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#123F4B]">
                Pourquoi cette recommandation ?
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#819399]">
                {offer.raison}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}

      <div
        className="
          mt-4
          flex
          flex-col
          gap-3
          border-t
          border-[#edf2f3]
          pt-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p className="flex items-center gap-1.5 text-[10px] text-[#94A4A9]">
          <IconCalendar className="h-3 w-3 text-[#08B7C9]" />

          Du {formatDate(offer?.date_debut)} au{" "}
          {formatDate(offer?.date_fin)}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onApply(offer)}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              bg-[#08B7C9]
              px-3
              py-2
              text-[10px]
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#079eae]
              hover:shadow-md
            "
          >
            <IconBriefcase className="h-3 w-3" />
            Postuler
          </button>

          {offer?.company_id && (
            <button
              type="button"
              onClick={() => onContact(offer)}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-[#cfeef1]
                bg-[#EAFBFC]
                px-3
                py-2
                text-[10px]
                font-semibold
                text-[#08B7C9]
                transition
                hover:border-[#08B7C9]
                hover:bg-[#dff7f9]
                hover:text-[#123F4B]
              "
            >
              <IconMessageCircle className="h-3 w-3" />
              Contacter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AI RECOMMENDATIONS SECTION
========================================================= */

function RecommendationsSection({
  recommendations,
  loading,
  onApply,
  onContact,
}) {
  if (loading) {
    return (
      <section className="mb-8">
        <div className="mb-4">
          <div className="h-2.5 w-28 animate-pulse rounded bg-[#dce7e9]" />

          <div className="mt-2 h-5 w-64 animate-pulse rounded bg-[#e4edef]" />

          <div className="mt-2 h-3 w-80 max-w-full animate-pulse rounded bg-[#edf2f3]" />
        </div>

        <div className="grid gap-4">
          <div className="h-64 animate-pulse rounded-2xl border border-[#e4edef] bg-white" />

          <div className="h-64 animate-pulse rounded-2xl border border-[#e4edef] bg-white" />
        </div>
      </section>
    );
  }

  if (!Array.isArray(recommendations)) {
    return null;
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="mb-9">
      {/* SECTION HEADER */}

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EAFBFC] text-[#08B7C9]">
            ✦
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#08B7C9]">
            Intelligence artificielle
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-[#123F4B]">
              Recommandations pour vous
            </h2>

            <p className="mt-1 text-[11px] text-[#819399]">
              Les offres les plus compatibles
              avec votre profil, vos compétences
              et votre CV.
            </p>
          </div>

          <span className="text-[10px] font-medium text-[#94A4A9]">
            {recommendations.length}{" "}
            {recommendations.length > 1
              ? "offres recommandées"
              : "offre recommandée"}
          </span>
        </div>
      </div>

      {/* AI CARDS */}

      <div className="grid gap-4">
        {recommendations.map(
          (recommendation, index) => (
            <RecommendationCard
              key={
                recommendation.offer_id ||
                recommendation.id ||
                index
              }
              recommendation={recommendation}
              onApply={onApply}
              onContact={onContact}
            />
          )
        )}
      </div>
    </section>
  );
}

/* =========================================================
   OFFER CARD
========================================================= */

function OfferCard({
  offer,
  user,
  onApply,
  onContact,
}) {
  const meta =
    TYPE_META[offer?.type] ?? {
      label: offer?.type || "Stage",
      tone: "neutral",
    };

  const timing = getTiming(
    offer?.date_debut,
    offer?.date_fin
  );

  const competences =
    typeof offer?.competences_requises ===
    "string"
      ? offer.competences_requises
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const companyName =
    offer?.company?.nom ||
    offer?.entreprise ||
    "Entreprise";

  return (
    <div
      className="
        group
        rounded-2xl
        border border-[#e4edef]
        bg-white
        p-5
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
        transition-all
        duration-300
        hover:-translate-y-[2px]
        hover:border-[#c9e9ec]
        hover:shadow-[0_8px_25px_rgba(18,63,75,0.08)]
      "
    >
      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar
            name={companyName}
            square
            size="md"
          />

          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold text-[#123F4B]">
              {offer?.titre ||
                "Offre sans titre"}
            </h2>

            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#819399]">
              <IconBuilding className="h-3 w-3 text-[#08B7C9]" />

              {companyName}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap justify-end gap-1">
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

      {/* DESCRIPTION */}

      {offer?.description && (
        <p className="mt-4 line-clamp-2 text-xs leading-5 text-[#819399]">
          {offer.description}
        </p>
      )}

      {/* COMPETENCES */}

      {competences.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {competences.map(
            (competence, index) => (
              <span
                key={`${competence}-${index}`}
                className="
                  rounded-md
                  border
                  border-[#d8f1f3]
                  bg-[#EAFBFC]
                  px-2
                  py-1
                  text-[10px]
                  font-medium
                  text-[#08B7C9]
                "
              >
                {competence}
              </span>
            )
          )}
        </div>
      )}

      {/* FOOTER */}

      <div
        className="
          mt-4
          flex
          flex-col
          gap-3
          border-t
          border-[#edf2f3]
          pt-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <p className="flex items-center gap-1.5 text-[10px] text-[#94A4A9]">
          <IconCalendar className="h-3 w-3 text-[#08B7C9]" />

          Du {formatDate(offer?.date_debut)} au{" "}
          {formatDate(offer?.date_fin)}
        </p>

        {user?.role === "etudiant" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onApply(offer)}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                bg-[#08B7C9]
                px-3
                py-2
                text-[10px]
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#079eae]
                hover:shadow-md
              "
            >
              <IconBriefcase className="h-3 w-3" />

              Postuler
            </button>

            {offer?.company_id && (
              <button
                type="button"
                onClick={() =>
                  onContact(offer)
                }
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-[#cfeef1]
                  bg-[#EAFBFC]
                  px-3
                  py-2
                  text-[10px]
                  font-semibold
                  text-[#08B7C9]
                  transition
                  hover:border-[#08B7C9]
                  hover:bg-[#dff7f9]
                  hover:text-[#123F4B]
                "
              >
                <IconMessageCircle className="h-3 w-3" />

                Contacter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   FILTER CHIP
========================================================= */

function FilterChip({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        rounded-full
        border
        px-3
        py-1.5
        text-[10px]
        font-semibold
        transition
        ${
          active
            ? "border-[#bfecef] bg-[#EAFBFC] text-[#08B7C9]"
            : "border-[#e4edef] bg-white text-[#819399] hover:border-[#c9e9ec] hover:bg-[#f5fbfc] hover:text-[#123F4B]"
        }
      `}
    >
      {children}
    </button>
  );
}

/* =========================================================
   OFFERS SEARCH / FILTER
========================================================= */

function OffersFilters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
}) {
  return (
    <div
      className="
        mb-5
        rounded-2xl
        border border-[#e4edef]
        bg-white
        p-3
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
      "
    >
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <IconSearch
            className="
              absolute
              left-3
              top-1/2
              h-3.5
              w-3.5
              -translate-y-1/2
              text-[#94A4A9]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Rechercher une offre, une entreprise ou une compétence..."
            className="
              w-full
              rounded-lg
              border border-[#e4edef]
              bg-[#f5f7f8]
              py-2.5
              pl-9
              pr-3
              text-xs
              text-[#123F4B]
              outline-none
              transition
              placeholder:text-[#94A4A9]
              focus:border-[#08B7C9]
              focus:bg-white
              focus:ring-4
              focus:ring-[#EAFBFC]
            "
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={typeFilter === "all"}
            onClick={() =>
              setTypeFilter("all")
            }
          >
            Toutes
          </FilterChip>

          {Object.entries(TYPE_META).map(
            ([key, meta]) => (
              <FilterChip
                key={key}
                active={typeFilter === key}
                onClick={() =>
                  setTypeFilter(key)
                }
              >
                {meta.label}
              </FilterChip>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CREATE OFFER FORM
========================================================= */

function CreateOfferForm({
  form,
  setForm,
  onSubmit,
}) {
  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="
        mb-6
        rounded-2xl
        border border-[#e4edef]
        bg-white
        p-5
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
      "
    >
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#08B7C9]">
          Nouvelle offre
        </p>

        <h2 className="mt-1 text-[15px] font-bold text-[#123F4B]">
          Publier une opportunité
        </h2>
      </div>

      <div className="space-y-3">
        <input
          placeholder="Titre de l'offre"
          value={form.titre}
          onChange={(event) =>
            updateForm(
              "titre",
              event.target.value
            )
          }
          className="
            w-full
            rounded-lg
            border border-[#e4edef]
            bg-white
            px-3
            py-2.5
            text-xs
            text-[#123F4B]
            outline-none
            transition
            placeholder:text-[#94A4A9]
            focus:border-[#08B7C9]
            focus:ring-4
            focus:ring-[#EAFBFC]
          "
          required
        />

        <textarea
          placeholder="Description de l'offre"
          value={form.description}
          onChange={(event) =>
            updateForm(
              "description",
              event.target.value
            )
          }
          className="
            min-h-[100px]
            w-full
            resize-none
            rounded-lg
            border border-[#e4edef]
            bg-white
            px-3
            py-2.5
            text-xs
            text-[#123F4B]
            outline-none
            transition
            placeholder:text-[#94A4A9]
            focus:border-[#08B7C9]
            focus:ring-4
            focus:ring-[#EAFBFC]
          "
          required
        />

        <input
          placeholder="Compétences requises — ex. React, Laravel, Docker"
          value={
            form.competences_requises
          }
          onChange={(event) =>
            updateForm(
              "competences_requises",
              event.target.value
            )
          }
          className="
            w-full
            rounded-lg
            border border-[#e4edef]
            bg-white
            px-3
            py-2.5
            text-xs
            text-[#123F4B]
            outline-none
            transition
            placeholder:text-[#94A4A9]
            focus:border-[#08B7C9]
            focus:ring-4
            focus:ring-[#EAFBFC]
          "
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] font-semibold text-[#819399]">
              Date de début
            </label>

            <input
              type="date"
              value={form.date_debut}
              onChange={(event) =>
                updateForm(
                  "date_debut",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border border-[#e4edef]
                bg-white
                px-3
                py-2.5
                text-xs
                text-[#123F4B]
                outline-none
                transition
                focus:border-[#08B7C9]
                focus:ring-4
                focus:ring-[#EAFBFC]
              "
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-semibold text-[#819399]">
              Date de fin
            </label>

            <input
              type="date"
              value={form.date_fin}
              onChange={(event) =>
                updateForm(
                  "date_fin",
                  event.target.value
                )
              }
              className="
                w-full
                rounded-lg
                border border-[#e4edef]
                bg-white
                px-3
                py-2.5
                text-xs
                text-[#123F4B]
                outline-none
                transition
                focus:border-[#08B7C9]
                focus:ring-4
                focus:ring-[#EAFBFC]
              "
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold text-[#819399]">
            Type de stage
          </label>

          <select
            value={form.type}
            onChange={(event) =>
              updateForm(
                "type",
                event.target.value
              )
            }
            className="
              w-full
              rounded-lg
              border border-[#e4edef]
              bg-white
              px-3
              py-2.5
              text-xs
              text-[#123F4B]
              outline-none
              transition
              focus:border-[#08B7C9]
              focus:ring-4
              focus:ring-[#EAFBFC]
            "
          >
            {Object.entries(TYPE_META).map(
              ([key, meta]) => (
                <option
                  key={key}
                  value={key}
                >
                  {meta.label}
                </option>
              )
            )}
          </select>
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            className="
              !rounded-lg
              !bg-[#08B7C9]
              !px-4
              !py-2.5
              !text-xs
              !font-semibold
              !text-white
              hover:!bg-[#079eae]
              hover:!shadow-md
            "
          >
            Publier l'offre
          </Button>
        </div>
      </div>
    </form>
  );
}

/* =========================================================
   OFFERS SECTION
========================================================= */

function OffersSection({
  user,
  offers,
  filteredOffers,
  loading,
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  onApply,
  onContact,
}) {
  return (
    <section className="border-t border-[#dfeaec] pt-7">
      {/* SECTION HEADER */}

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#08B7C9]" />

          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#819399]">
            Opportunités
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-[#123F4B]">
              Toutes les offres
            </h2>

            <p className="mt-1 text-[11px] text-[#819399]">
              {user?.role === "entreprise"
                ? "Consultez les offres disponibles sur la plateforme."
                : "Explorez toutes les opportunités disponibles."}
            </p>
          </div>

          {!loading && (
            <span className="text-[10px] font-medium text-[#94A4A9]">
              {filteredOffers.length}{" "}
              {filteredOffers.length > 1
                ? "offres"
                : "offre"}
            </span>
          )}
        </div>
      </div>

      {/* SEARCH */}

      {!loading && offers.length > 0 && (
        <OffersFilters
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
        />
      )}

      {/* OFFERS */}

      {loading ? (
        <div className="grid gap-4">
          <SkeletonOfferCard />
          <SkeletonOfferCard />
          <SkeletonOfferCard />
        </div>
      ) : filteredOffers.length === 0 ? (
        <EmptyState
          icon={
            <IconInbox className="h-9 w-9" />
          }
          title={
            offers.length === 0
              ? "Aucune offre disponible"
              : "Aucun résultat"
          }
          description={
            offers.length === 0
              ? user?.role ===
                "entreprise"
                ? "Publiez votre première offre pour commencer à recevoir des candidatures."
                : "De nouvelles opportunités seront bientôt disponibles."
              : "Essayez un autre mot-clé ou modifiez le filtre."
          }
        />
      ) : (
        <div className="grid gap-4">
          {filteredOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              user={user}
              onApply={onApply}
              onContact={onContact}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   MAIN OFFERS PAGE
========================================================= */

export default function Offers() {
  const { user } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  /* =======================================================
     OFFERS
  ======================================================= */

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     AI RECOMMENDATIONS
  ======================================================= */

  const [recommendations, setRecommendations] =
    useState([]);

  const [
    loadingRecommendations,
    setLoadingRecommendations,
  ] = useState(false);

  /* =======================================================
     CREATE OFFER
  ======================================================= */

  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    titre: "",
    description: "",
    competences_requises: "",
    date_debut: "",
    date_fin: "",
    type: "pfe",
  });

  /* =======================================================
     SEARCH / FILTER
  ======================================================= */

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("all");

  /* =======================================================
     APPLICATION
  ======================================================= */

  const [applyingOffer, setApplyingOffer] =
    useState(null);

  /* =======================================================
     START CONVERSATION
  ======================================================= */

  const startConversation = async (
    offer
  ) => {
    const companyId =
      offer?.company_id ||
      offer?.company?.id;

    const offerId =
      offer?.id ||
      offer?.offer_id;

    if (!companyId) {
      notify(
        "Impossible d'identifier l'entreprise.",
        "error"
      );

      return;
    }

    if (!offerId) {
      notify(
        "Impossible d'identifier l'offre.",
        "error"
      );

      return;
    }

    try {
      const response = await api.post(
        "/conversations",
        {
          company_id: companyId,
          internship_offer_id: offerId,
        }
      );

      if (response?.data?.id) {
        navigate(
          `/messages?conversation=${response.data.id}`
        );
      } else {
        notify(
          "Conversation créée, mais impossible de l'ouvrir.",
          "error"
        );
      }
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
     LOAD OFFERS
  ======================================================= */

  const loadOffers = async () => {
    setLoading(true);

    try {
      const response = await api.get(
        "/offers"
      );

      const data =
        Array.isArray(response.data)
          ? response.data
          : response.data?.offers || [];

      setOffers(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Erreur offres :",
        err?.response?.data || err
      );

      setOffers([]);

      notify(
        "Impossible de charger les offres.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     LOAD AI RECOMMENDATIONS
     
     IMPORTANT:
     CETTE FONCTION N'EST APPELÉE QUE POUR
     UN ÉTUDIANT.
  ======================================================= */

  const loadRecommendations = async () => {
    if (
      user?.role !== "etudiant" ||
      !user?.student?.id
    ) {
      setRecommendations([]);
      return;
    }

    setLoadingRecommendations(true);

    try {
      const response = await api.get(
        `/students/${user.student.id}/recommendations`
      );

      const data =
        response.data?.recommendations ||
        [];

      setRecommendations(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Erreur recommandations IA :",
        err?.response?.data || err
      );

      setRecommendations([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadOffers();
  }, []);

  /* =======================================================
     LOAD RECOMMENDATIONS
     
     L'IA EST STRICTEMENT LIMITÉE À L'ÉTUDIANT.
  ======================================================= */

  useEffect(() => {
    if (
      user?.role === "etudiant" &&
      user?.student?.id
    ) {
      loadRecommendations();
    } else {
      setRecommendations([]);
      setLoadingRecommendations(false);
    }
  }, [
    user?.role,
    user?.student?.id,
  ]);

  /* =======================================================
     CREATE OFFER
  ======================================================= */

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await api.post(
        "/offers",
        form
      );

      setForm({
        titre: "",
        description: "",
        competences_requises: "",
        date_debut: "",
        date_fin: "",
        type: "pfe",
      });

      setShowForm(false);

      notify(
        "Offre publiée.",
        "success"
      );

      await loadOffers();
    } catch (err) {
      console.error(
        "Erreur création offre :",
        err?.response?.data || err
      );

      notify(
        err?.response?.data?.message ||
          "Impossible de publier l'offre.",
        "error"
      );
    }
  };

  /* =======================================================
     APPLICATION SUBMITTED
  ======================================================= */

  const handleApplySubmitted = () => {
    setApplyingOffer(null);
  };

  /* =======================================================
     FILTER OFFERS
  ======================================================= */

  const filteredOffers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return offers.filter((offer) => {
      const matchesType =
        typeFilter === "all" ||
        offer?.type === typeFilter;

      const title =
        offer?.titre?.toLowerCase() || "";

      const company =
        offer?.company?.nom?.toLowerCase() ||
        offer?.entreprise?.toLowerCase() ||
        "";

      const competences =
        offer?.competences_requises?.toLowerCase() ||
        "";

      const description =
        offer?.description?.toLowerCase() ||
        "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        company.includes(query) ||
        competences.includes(query) ||
        description.includes(query);

      return (
        matchesType &&
        matchesSearch
      );
    });
  }, [
    offers,
    search,
    typeFilter,
  ]);

  /* =======================================================
     RECOMMENDATION -> OFFER
  ======================================================= */

  const getRecommendationOffer = (
    recommendation
  ) => {
    return {
      ...recommendation,
      id:
        recommendation?.offer_id ||
        recommendation?.id,
      company_id:
        recommendation?.company_id ||
        recommendation?.company?.id,
    };
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-full
        bg-[#f5f7f8]
      "
    >
      <div
        className="
          mx-auto
          max-w-6xl
          px-5
          py-7
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="mb-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#08B7C9]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#08B7C9]">
                  {user?.role ===
                  "entreprise"
                    ? "Espace entreprise"
                    : "Opportunités"}
                </span>
              </div>

           
              <p className="mt-1.5 text-[13px] text-[#819399]">
                {user?.role ===
                "entreprise"
                  ? "Publiez et gérez vos offres de stage."
                  : "Découvrez les opportunités correspondant à votre profil."}
              </p>
            </div>

            {/* ENTREPRISE UNIQUEMENT */}

            {user?.role ===
              "entreprise" && (
              <Button
                onClick={() =>
                  setShowForm(
                    (current) => !current
                  )
                }
                className="
                  !rounded-lg
                  !bg-[#08B7C9]
                  !px-4
                  !py-2.5
                  !text-xs
                  !font-semibold
                  !text-white
                  hover:!bg-[#079eae]
                  hover:!shadow-md
                "
              >
                {showForm
                  ? "Annuler"
                  : "+ Publier une offre"}
              </Button>
            )}
          </div>
        </div>

        {/* =================================================
            CREATE OFFER
            ENTREPRISE UNIQUEMENT
        ================================================= */}

        {user?.role === "entreprise" &&
          showForm && (
            <CreateOfferForm
              form={form}
              setForm={setForm}
              onSubmit={handleCreate}
            />
          )}

        {/* =================================================
            AI RECOMMENDATIONS
            ÉTUDIANT UNIQUEMENT
        ================================================= */}

        {user?.role === "etudiant" && (
          <RecommendationsSection
            recommendations={
              recommendations
            }
            loading={
              loadingRecommendations
            }
            onApply={(recommendation) =>
              setApplyingOffer(
                getRecommendationOffer(
                  recommendation
                )
              )
            }
            onContact={(recommendation) =>
              startConversation(
                getRecommendationOffer(
                  recommendation
                )
              )
            }
          />
        )}

        {/* =================================================
            TOUTES LES OFFRES
            ÉTUDIANT + ENTREPRISE
        ================================================= */}

        <OffersSection
          user={user}
          offers={offers}
          filteredOffers={
            filteredOffers
          }
          loading={loading}
          search={search}
          setSearch={setSearch}
          typeFilter={typeFilter}
          setTypeFilter={
            setTypeFilter
          }
          onApply={setApplyingOffer}
          onContact={startConversation}
        />
      </div>

      {/* ===================================================
          APPLY MODAL
          
          UNIQUEMENT UTILISÉ PAR L'ÉTUDIANT
      =================================================== */}

      {user?.role === "etudiant" &&
        applyingOffer && (
          <ApplyModal
            offer={applyingOffer}
            user={user}
            onClose={() =>
              setApplyingOffer(null)
            }
            onSubmitted={
              handleApplySubmitted
            }
          />
        )}
    </div>
  );
}