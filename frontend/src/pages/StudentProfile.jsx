import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

/* =========================================================
   ICONS
========================================================= */

const Icon = {
  edit: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  book: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M4 19.5A2.5 2.5 0 016.5 17H20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  file: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  target: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  ),

  link: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  upload: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 8l-5-5-5 5M12 3v12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  camera: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),

  check: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  mail: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  phone: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.33 1.78.62 2.63a2 2 0 01-.45 2.11L8 9.73a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0122 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  location: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1116 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  ),

  calendar: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),

  external: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M14 3h7v7M10 14L21 3M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  arrow: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  user: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0116 0" strokeLinecap="round" />
    </svg>
  ),

  sparkles: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/* =========================================================
   CONSTANTS
========================================================= */

const TYPE_STAGE_LABELS = {
  stage_ete: "Stage d'été",
  pfe: "PFE",
  stage_observation: "Stage d'observation",
};

const PROFILE_FIELDS = [
  "filiere",
  "niveau",
  "specialite",
  "telephone",
  "bio",
  "cv_path",
  "secteur_prefere",
  "localisation_preferee",
  "type_stage_prefere",
  "photo_path",
];

/* =========================================================
   HELPERS
========================================================= */

function getCompletion(student) {
  if (!student) {
    return 0;
  }

  const completedFields = PROFILE_FIELDS.filter(
    (field) => Boolean(student[field])
  ).length;

  return Math.round(
    (completedFields / PROFILE_FIELDS.length) * 100
  );
}

function getStableKey(value, prefix = "item") {
  if (typeof value === "string" || typeof value === "number") {
    return `${prefix}-${String(value).trim()}`;
  }

  if (value && typeof value === "object") {
    const identifier =
      value.id ??
      value.uuid ??
      value.code ??
      value.intitule ??
      value.poste ??
      value.nom ??
      value.name;

    if (identifier !== undefined && identifier !== null) {
      return `${prefix}-${String(identifier).trim()}`;
    }

    return `${prefix}-${JSON.stringify(value)}`;
  }

  return `${prefix}-empty`;
}

/* =========================================================
   SHARED COMPONENTS
========================================================= */

function Section({
  title,
  subtitle,
  icon,
  children,
  className = "",
}) {
  return (
    <section
      className={`
        bg-white
        border
        border-[#e4edef]
        rounded-2xl
        shadow-[0_3px_15px_rgba(18,63,75,0.045)]
        hover:shadow-[0_8px_25px_rgba(18,63,75,0.07)]
        transition-all
        duration-300
        ${className}
      `}
    >
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAFBFC] text-[#08B7C9] flex items-center justify-center shrink-0">
            {icon}
          </div>

          <div>
            <h2 className="text-[15px] font-semibold text-[#123F4B]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[11px] text-[#94A4A9] mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">{children}</div>
    </section>
  );
}

function Field({ label, value, icon }) {
  return (
    <div className="rounded-xl bg-[#f5f7f8] border border-[#e4edef] p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon && (
          <span className="text-[#819399]">{icon}</span>
        )}

        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#819399]">
          {label}
        </p>
      </div>

      <p
        className={`text-sm ${
          value
            ? "font-semibold text-[#123F4B]"
            : "italic text-[#b8c4c7]"
        }`}
      >
        {value || "Non renseigné"}
      </p>
    </div>
  );
}

function Input({
  label,
  id,
  name,
  ...props
}) {
  const fieldId = id || name || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-xs font-semibold text-[#526970] mb-2"
      >
        {label}
      </label>

      <input
        {...props}
        id={fieldId}
        name={name}
        className="
          w-full
          h-11
          border
          border-[#e4edef]
          rounded-xl
          px-3.5
          text-sm
          text-[#123F4B]
          bg-[#f5f7f8]
          placeholder:text-[#b8c4c7]
          focus:outline-none
          focus:ring-2
          focus:ring-[#08B7C9]/20
          focus:border-[#08B7C9]
          focus:bg-white
          transition-all
        "
      />
    </div>
  );
}

function MessageBanner({ message }) {
  if (!message) {
    return null;
  }

  const isError = message.includes("Erreur");

  return (
    <div
      className={`
        mb-6
        px-4
        py-3.5
        rounded-xl
        border
        text-sm
        flex
        items-center
        gap-2
        ${
          isError
            ? "bg-red-50 border-red-100 text-red-700"
            : "bg-[#EAFBFC] border-[#c9e9ec] text-[#123F4B]"
        }
      `}
    >
      <Icon.check className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}

/* =========================================================
   AI LIST COMPONENTS
========================================================= */

function CompetencesList({ competences }) {
  if (!Array.isArray(competences) || competences.length === 0) {
    return null;
  }

  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-[#526970] mb-2.5">
        Compétences détectées
      </p>

      <div className="flex flex-wrap gap-2">
        {competences.map((competence) => (
          <span
            key={getStableKey(competence, "competence")}
            className="
              text-xs
              font-semibold
              px-3
              py-1.5
              rounded-full
              bg-[#EAFBFC]
              text-[#087F8C]
              border
              border-[#c9e9ec]
            "
          >
            {competence}
          </span>
        ))}
      </div>
    </div>
  );
}

function DiplomesList({ diplomes }) {
  if (!Array.isArray(diplomes) || diplomes.length === 0) {
    return null;
  }

  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-[#526970] mb-2.5">
        Diplômes
      </p>

      <div className="space-y-2">
        {diplomes.map((diplome) => {
          const key = getStableKey(diplome, "diplome");

          return (
            <div
              key={key}
              className="
                rounded-lg
                bg-white
                border
                border-[#e4edef]
                px-3
                py-2.5
              "
            >
              <p className="text-xs font-semibold text-[#123F4B]">
                {diplome?.intitule || "Diplôme"}
              </p>

              {(diplome?.etablissement || diplome?.annee) && (
                <p className="text-[11px] text-[#819399] mt-1">
                  {diplome?.etablissement || ""}
                  {diplome?.etablissement && diplome?.annee
                    ? " · "
                    : ""}
                  {diplome?.annee || ""}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExperiencesList({ experiences }) {
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return null;
  }

  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-[#526970] mb-2.5">
        Expériences
      </p>

      <div className="space-y-2">
        {experiences.map((experience) => {
          const key = getStableKey(experience, "experience");

          return (
            <div
              key={key}
              className="
                rounded-lg
                bg-white
                border
                border-[#e4edef]
                px-3
                py-3
              "
            >
              <p className="text-xs font-semibold text-[#123F4B]">
                {experience?.poste || "Expérience"}
              </p>

              {(experience?.entreprise || experience?.duree) && (
                <p className="text-[11px] text-[#08B7C9] mt-1 font-medium">
                  {experience?.entreprise || ""}
                  {experience?.entreprise && experience?.duree
                    ? " · "
                    : ""}
                  {experience?.duree || ""}
                </p>
              )}

              {experience?.description && (
                <p className="text-[11px] text-[#819399] mt-1.5 leading-5">
                  {experience.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LanguesList({ langues }) {
  if (!Array.isArray(langues) || langues.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-semibold text-[#526970] mb-2.5">
        Langues
      </p>

      <div className="flex flex-wrap gap-2">
        {langues.map((langue) => (
          <span
            key={getStableKey(langue, "langue")}
            className="
              text-xs
              font-medium
              px-3
              py-1.5
              rounded-full
              bg-[#eef7f8]
              text-[#123F4B]
            "
          >
            {langue}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   EDIT PROFILE
========================================================= */

function StudentProfileEdit({
  student,
  message,
  saving,
  handleChange,
  handleSave,
  handleCvUpload,
  handlePhotoUpload,
  setEditMode,
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-[27px] md:text-[30px] font-bold text-[#123F4B]">
              Modifier mon profil
            </h1>

            <p className="text-[13px] text-[#819399] mt-1.5">
              Gardez vos informations à jour pour améliorer votre visibilité.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="
              inline-flex
              items-center
              justify-center
              px-4
              py-2.5
              rounded-xl
              border
              border-[#e4edef]
              bg-white
              text-sm
              font-semibold
              text-[#526970]
              hover:text-[#123F4B]
              hover:bg-[#f5f7f8]
              transition-all
            "
          >
            Annuler
          </button>
        </div>

        <MessageBanner message={message} />

        <div className="space-y-5">

          <Section
            title="Photo de profil"
            subtitle="Utilisez une photo professionnelle."
            icon={<Icon.camera className="w-5 h-5" />}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative">
                <img
                  src={
                    student.photo_path
                      ? `/storage/${student.photo_path}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          student.user?.name || "Etudiant"
                        )}&background=08B7C9&color=fff&bold=true`
                  }
                  alt={`Profil de ${student.user?.name || "l’étudiant"}`}
                  className="w-24 h-24 rounded-2xl object-cover border border-[#e4edef] shadow-sm"
                />

                <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#22C55E] border-4 border-white" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#123F4B]">
                  Votre photo
                </h3>

                <p className="text-xs text-[#819399] mt-1 mb-3">
                  JPG, PNG ou autre format image accepté.
                </p>

                <label
                  htmlFor="profile-photo-upload"
                  className="
                    cursor-pointer
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[#08B7C9]
                    bg-[#EAFBFC]
                    hover:bg-[#d9f7f9]
                    px-4
                    py-2.5
                    rounded-xl
                    transition-colors
                  "
                >
                  <Icon.camera className="w-4 h-4" />
                  Changer la photo

                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>
          </Section>

          <Section
            title="Formation & informations"
            subtitle="Vos informations académiques et personnelles."
            icon={<Icon.book className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Filière"
                name="filiere"
                value={student.filiere || ""}
                onChange={handleChange}
                placeholder="Ex. Systèmes d'information"
              />

              <Input
                label="Spécialité"
                name="specialite"
                value={student.specialite || ""}
                onChange={handleChange}
                placeholder="Ex. Cloud & DevOps"
              />

              <Input
                label="Niveau"
                name="niveau"
                value={student.niveau || ""}
                onChange={handleChange}
                placeholder="Ex. Master"
              />

              <Input
                label="Téléphone"
                name="telephone"
                value={student.telephone || ""}
                onChange={handleChange}
                placeholder="+212 ..."
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="profile-bio"
                className="block text-xs font-semibold text-[#526970] mb-2"
              >
                Présentation
              </label>

              <textarea
                id="profile-bio"
                name="bio"
                value={student.bio || ""}
                onChange={handleChange}
                rows={5}
                placeholder="Présentez-vous en quelques lignes..."
                className="
                  w-full
                  border
                  border-[#e4edef]
                  rounded-xl
                  px-3.5
                  py-3
                  text-sm
                  text-[#123F4B]
                  bg-[#f5f7f8]
                  placeholder:text-[#b8c4c7]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[#08B7C9]/20
                  focus:border-[#08B7C9]
                  focus:bg-white
                  transition-all
                  resize-none
                "
              />
            </div>
          </Section>

          <Section
            title="Curriculum vitae"
            subtitle="Ajoutez un CV à jour pour vos candidatures."
            icon={<Icon.file className="w-5 h-5" />}
          >
            <div
              className="
                rounded-xl
                border
                border-[#e4edef]
                bg-[#f5f7f8]
                p-4
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-4
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <Icon.file className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#123F4B]">
                    {student.cv_path
                      ? "CV actuellement enregistré"
                      : "Aucun CV enregistré"}
                  </p>

                  <p className="text-xs text-[#819399] mt-0.5">
                    Format recommandé : PDF
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">

                {student.cv_path && (
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/storage/${student.cv_path}`,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="
                      px-3.5
                      py-2
                      rounded-lg
                      bg-white
                      border
                      border-[#e4edef]
                      text-xs
                      font-semibold
                      text-[#526970]
                      hover:bg-[#f5f7f8]
                    "
                  >
                    Voir le CV
                  </button>
                )}

                <label
                  htmlFor="cv-upload"
                  className="
                    cursor-pointer
                    inline-flex
                    items-center
                    gap-2
                    px-3.5
                    py-2
                    rounded-lg
                    bg-[#08B7C9]
                    hover:bg-[#079FB0]
                    text-white
                    text-xs
                    font-semibold
                    transition-colors
                  "
                >
                  <Icon.upload className="w-4 h-4" />
                  {student.cv_path ? "Remplacer" : "Ajouter"}

                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleCvUpload}
                  />
                </label>

              </div>
            </div>
          </Section>

          <Section
            title="Préférences de stage"
            subtitle="Aidez les recruteurs à mieux comprendre votre recherche."
            icon={<Icon.target className="w-5 h-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <Input
                label="Secteur préféré"
                name="secteur_prefere"
                value={student.secteur_prefere || ""}
                onChange={handleChange}
                placeholder="Ex. IT, Finance, Industrie..."
              />

              <Input
                label="Localisation préférée"
                name="localisation_preferee"
                value={student.localisation_preferee || ""}
                onChange={handleChange}
                placeholder="Ex. Casablanca"
              />

              <div>
                <label
                  htmlFor="type-stage-prefere"
                  className="block text-xs font-semibold text-[#526970] mb-2"
                >
                  Type de stage préféré
                </label>

                <select
                  id="type-stage-prefere"
                  name="type_stage_prefere"
                  value={student.type_stage_prefere || ""}
                  onChange={handleChange}
                  className="
                    w-full
                    h-11
                    border
                    border-[#e4edef]
                    rounded-xl
                    px-3.5
                    text-sm
                    text-[#123F4B]
                    bg-[#f5f7f8]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#08B7C9]/20
                    focus:border-[#08B7C9]
                    focus:bg-white
                    transition-all
                  "
                >
                  <option value="">Sélectionner</option>
                  <option value="stage_ete">Stage d'été</option>
                  <option value="pfe">PFE</option>
                  <option value="stage_observation">
                    Stage d'observation
                  </option>
                </select>
              </div>

              <Input
                label="Disponible à partir de"
                type="date"
                name="disponibilite_date"
                value={student.disponibilite_date || ""}
                onChange={handleChange}
              />
            </div>
          </Section>

          <Section
            title="Présence en ligne"
            subtitle="Ajoutez vos profils professionnels."
            icon={<Icon.link className="w-5 h-5" />}
          >
            <div className="space-y-4">
              <Input
                label="LinkedIn"
                name="linkedin_url"
                placeholder="https://linkedin.com/in/..."
                value={student.linkedin_url || ""}
                onChange={handleChange}
              />

              <Input
                label="GitHub"
                name="github_url"
                placeholder="https://github.com/..."
                value={student.github_url || ""}
                onChange={handleChange}
              />

              <Input
                label="Portfolio"
                name="portfolio_url"
                placeholder="https://..."
                value={student.portfolio_url || ""}
                onChange={handleChange}
              />
            </div>
          </Section>
        </div>

        <div className="sticky bottom-4 mt-6">
          <div
            className="
              bg-[#123F4B]
              rounded-2xl
              p-3
              sm:p-4
              shadow-xl
              flex
              flex-col
              sm:flex-row
              sm:items-center
              justify-between
              gap-3
            "
          >
            <div className="px-2">
              <p className="text-sm font-semibold text-white">
                Vos modifications sont prêtes ?
              </p>

              <p className="text-xs text-[#9fb5ba] mt-0.5">
                Enregistrez pour mettre à jour votre profil.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  font-semibold
                  text-[#b8c9cd]
                  hover:text-white
                  hover:bg-white/10
                  transition-colors
                "
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="
                  px-5
                  py-2.5
                  rounded-xl
                  bg-[#08B7C9]
                  hover:bg-[#079FB0]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  text-white
                  text-sm
                  font-semibold
                  shadow-lg
                  transition-all
                "
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   PROFILE VIEW
========================================================= */

function StudentProfileView({
  student,
  message,
  completion,
  linkItems,
  hasAnyLink,
  handleExtractCv,
  extracting,
  setEditMode,
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[27px] md:text-[30px] font-bold text-[#123F4B]">
              Mon profil
            </h1>

            <p className="text-[13px] text-[#819399] mt-1.5">
              Gérez votre identité professionnelle et vos informations de stage.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-[#08B7C9]
              hover:bg-[#079FB0]
              text-white
              text-sm
              font-semibold
              shadow-sm
              shadow-[#08B7C9]/20
              transition-all
            "
          >
            <Icon.edit className="w-4 h-4" />
            Modifier le profil
          </button>
        </div>

        <MessageBanner message={message} />

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[#123F4B]
            shadow-xl
            mb-5
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#123F4B]
              via-[#155565]
              to-[#08B7C9]
            "
          />

          <div
            className="
              absolute
              -top-32
              -right-24
              w-80
              h-80
              rounded-full
              bg-[#08B7C9]/20
              blur-3xl
            "
          />

          <div
            className="
              absolute
              -bottom-40
              left-1/3
              w-96
              h-96
              rounded-full
              bg-white/5
              blur-3xl
            "
          />

          <div className="relative p-6 sm:p-8">

            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-7">

              <div className="flex flex-col sm:flex-row items-start gap-5">

                <div className="relative shrink-0">
                  <img
                    src={
                      student.photo_path
                        ? `/storage/${student.photo_path}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            student.user?.name || "Etudiant"
                          )}&background=ffffff&color=123F4B&bold=true&size=160`
                    }
                    alt={`Profil de ${student.user?.name || "l’étudiant"}`}
                    className="
                      w-24
                      h-24
                      sm:w-28
                      sm:h-28
                      rounded-2xl
                      object-cover
                      border-4
                      border-white/15
                      shadow-xl
                    "
                  />

                  <span
                    className="
                      absolute
                      -bottom-2
                      -right-2
                      flex
                      items-center
                      gap-1.5
                      px-2.5
                      py-1
                      rounded-full
                      bg-[#22C55E]
                      text-white
                      text-[10px]
                      font-bold
                      border-4
                      border-[#155565]
                    "
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Actif
                  </span>
                </div>

                <div className="pt-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2
                      className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-white
                        tracking-tight
                      "
                    >
                      {student.user?.name || "Étudiant"}
                    </h2>
                  </div>

                  <p className="text-[#bceff3] text-sm font-medium">
                    {student.niveau || "Étudiant"}
                    {student.filiere ? ` · ${student.filiere}` : ""}
                  </p>

                  <div
                    className="
                      flex
                      flex-wrap
                      gap-x-4
                      gap-y-2
                      mt-4
                      text-xs
                      text-white/75
                    "
                  >
                    {student.user?.email && (
                      <span className="flex items-center gap-1.5">
                        <Icon.mail className="w-3.5 h-3.5" />
                        {student.user.email}
                      </span>
                    )}

                    {student.telephone && (
                      <span className="flex items-center gap-1.5">
                        <Icon.phone className="w-3.5 h-3.5" />
                        {student.telephone}
                      </span>
                    )}

                    {student.localisation_preferee && (
                      <span className="flex items-center gap-1.5">
                        <Icon.location className="w-3.5 h-3.5" />
                        {student.localisation_preferee}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="
                  lg:w-72
                  rounded-2xl
                  bg-white/10
                  backdrop-blur-sm
                  border
                  border-white/10
                  p-4
                "
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-white">
                      Profil complété
                    </p>

                    <p className="text-[11px] text-[#bceff3] mt-0.5">
                      {completion === 100
                        ? "Votre profil est complet"
                        : "Complétez votre profil"}
                    </p>
                  </div>

                  <span className="text-lg font-bold text-white">
                    {completion}%
                  </span>
                </div>

                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#08B7C9] rounded-full transition-all duration-700"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>

            {student.bio && (
              <div className="mt-7 pt-5 border-t border-white/10">
                <p className="text-sm leading-6 text-white/80 max-w-3xl">
                  {student.bio}
                </p>
              </div>
            )}

            {hasAnyLink && (
              <div className="flex flex-wrap gap-2 mt-5">
                {linkItems.map((link) => {
                  if (!link.url) {
                    return null;
                  }

                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        px-3.5
                        py-2
                        rounded-xl
                        bg-white/10
                        hover:bg-white/15
                        border
                        border-white/10
                        text-white
                        text-xs
                        font-semibold
                        transition-all
                      "
                    >
                      <span
                        className="
                          w-5
                          h-5
                          rounded-md
                          bg-white/10
                          flex
                          items-center
                          justify-center
                          text-[9px]
                          font-bold
                        "
                      >
                        {link.short}
                      </span>

                      {link.label}

                      <Icon.external className="w-3 h-3 opacity-60" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 space-y-5">

            <Section
              title="Formation"
              subtitle="Votre parcours académique."
              icon={<Icon.book className="w-5 h-5" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Filière" value={student.filiere} />
                <Field label="Spécialité" value={student.specialite} />
                <Field label="Niveau" value={student.niveau} />
                <Field label="Téléphone" value={student.telephone} />
              </div>
            </Section>

            <Section
              title="Votre document professionnel"
              subtitle="Analysez votre CV pour détecter automatiquement vos compétences."
              icon={<Icon.file className="w-5 h-5" />}
            >
              {student.cv_path ? (
                <div className="space-y-4">

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      justify-between
                      gap-4
                      rounded-xl
                      border
                      border-[#e4edef]
                      bg-[#f5f7f8]
                      p-4
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          w-12
                          h-12
                          rounded-xl
                          bg-red-50
                          text-red-500
                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Icon.file className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#123F4B]">
                          Curriculum vitae
                        </p>

                        <p className="text-xs text-[#819399] mt-0.5">
                          Document PDF disponible
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/storage/${student.cv_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-2.5
                          rounded-xl
                          bg-white
                          border
                          border-[#e4edef]
                          text-[#526970]
                          hover:bg-[#eef7f8]
                          text-xs
                          font-semibold
                          transition-colors
                        "
                      >
                        Voir le CV
                        <Icon.arrow className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={handleExtractCv}
                        disabled={extracting}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          px-4
                          py-2.5
                          rounded-xl
                          bg-[#EAFBFC]
                          hover:bg-[#d9f7f9]
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                          text-[#08B7C9]
                          text-xs
                          font-bold
                          border
                          border-[#c9e9ec]
                          transition-all
                        "
                      >
                        <Icon.sparkles className="w-4 h-4" />

                        {extracting
                          ? "Analyse en cours..."
                          : "Analyser mon CV avec l'IA"}
                      </button>
                    </div>
                  </div>

                  {student.cv_extracted && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-[#c9e9ec]
                        bg-[#F7FEFF]
                        p-5
                      "
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-[#EAFBFC]
                            text-[#08B7C9]
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <Icon.sparkles className="w-4 h-4" />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#123F4B]">
                            Analyse IA du CV
                          </p>

                          <p className="text-xs text-[#819399] mt-0.5">
                            Informations détectées automatiquement.
                          </p>
                        </div>
                      </div>

                      <CompetencesList
                        competences={
                          student.cv_extracted.competences
                        }
                      />

                      <DiplomesList
                        diplomes={student.cv_extracted.diplomes}
                      />

                      <ExperiencesList
                        experiences={
                          student.cv_extracted.experiences
                        }
                      />

                      <LanguesList
                        langues={student.cv_extracted.langues}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-[#dcecef]
                    p-7
                    text-center
                  "
                >
                  <div
                    className="
                      w-11
                      h-11
                      mx-auto
                      rounded-xl
                      bg-[#EAFBFC]
                      text-[#08B7C9]
                      flex
                      items-center
                      justify-center
                      mb-3
                    "
                  >
                    <Icon.file className="w-5 h-5" />
                  </div>

                  <p className="text-sm font-semibold text-[#526970]">
                    Aucun CV disponible
                  </p>

                  <p className="text-xs text-[#819399] mt-1">
                    Ajoutez votre CV depuis le mode modification.
                  </p>
                </div>
              )}
            </Section>

            <Section
              title="Préférences de stage"
              subtitle="Ce que vous recherchez actuellement."
              icon={<Icon.target className="w-5 h-5" />}
            >
              <div className="flex flex-wrap gap-2 mb-4">

                {student.secteur_prefere && (
                  <span
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1.5
                      rounded-lg
                      bg-[#EAFBFC]
                      text-[#08B7C9]
                      text-xs
                      font-semibold
                    "
                  >
                    {student.secteur_prefere}
                  </span>
                )}

                {student.localisation_preferee && (
                  <span
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1.5
                      rounded-lg
                      bg-[#eef7f8]
                      text-[#123F4B]
                      text-xs
                      font-semibold
                    "
                  >
                    {student.localisation_preferee}
                  </span>
                )}

                {TYPE_STAGE_LABELS[student.type_stage_prefere] && (
                  <span
                    className="
                      inline-flex
                      items-center
                      px-3
                      py-1.5
                      rounded-lg
                      bg-amber-50
                      text-amber-700
                      text-xs
                      font-semibold
                    "
                  >
                    {TYPE_STAGE_LABELS[student.type_stage_prefere]}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  label="Secteur préféré"
                  value={student.secteur_prefere}
                />

                <Field
                  label="Localisation"
                  value={student.localisation_preferee}
                />

                <Field
                  label="Type de stage"
                  value={
                    TYPE_STAGE_LABELS[student.type_stage_prefere]
                  }
                />

                <Field
                  label="Disponibilité"
                  value={student.disponibilite_date}
                  icon={
                    <Icon.calendar className="w-3.5 h-3.5" />
                  }
                />
              </div>
            </Section>
          </div>

          <div className="space-y-5">

            <Section
              title="Informations"
              subtitle="Coordonnées principales."
              icon={<Icon.user className="w-5 h-5" />}
            >
              <div className="space-y-3">

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    bg-[#f5f7f8]
                    border
                    border-[#e4edef]
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-white
                      border
                      border-[#e4edef]
                      text-[#08B7C9]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon.mail className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#819399]">
                      Email
                    </p>

                    <p className="text-xs font-semibold text-[#123F4B] truncate mt-0.5">
                      {student.user?.email || "Non renseigné"}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    bg-[#f5f7f8]
                    border
                    border-[#e4edef]
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-white
                      border
                      border-[#e4edef]
                      text-[#08B7C9]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon.phone className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#819399]">
                      Téléphone
                    </p>

                    <p className="text-xs font-semibold text-[#123F4B] mt-0.5">
                      {student.telephone || "Non renseigné"}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    p-3
                    rounded-xl
                    bg-[#f5f7f8]
                    border
                    border-[#e4edef]
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-lg
                      bg-white
                      border
                      border-[#e4edef]
                      text-[#08B7C9]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon.location className="w-4 h-4" />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#819399]">
                      Localisation
                    </p>

                    <p className="text-xs font-semibold text-[#123F4B] mt-0.5">
                      {student.localisation_preferee ||
                        "Non renseignée"}
                    </p>
                  </div>
                </div>

              </div>
            </Section>

            <Section
              title="Présence en ligne"
              subtitle="Vos profils professionnels."
              icon={<Icon.link className="w-5 h-5" />}
            >
              <div className="space-y-2">

                {linkItems.map((link) => {
                  if (!link.url) {
                    return null;
                  }

                  return (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        gap-3
                        p-3
                        rounded-xl
                        border
                        border-[#e4edef]
                        hover:border-[#bceff3]
                        hover:bg-[#EAFBFC]
                        transition-all
                        group
                      "
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            w-9
                            h-9
                            rounded-lg
                            bg-[#f5f7f8]
                            group-hover:bg-white
                            text-[#526970]
                            flex
                            items-center
                            justify-center
                            text-[10px]
                            font-bold
                          "
                        >
                          {link.short}
                        </div>

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-[#526970]
                            group-hover:text-[#123F4B]
                          "
                        >
                          {link.label}
                        </span>
                      </div>

                      <Icon.external
                        className="
                          w-4
                          h-4
                          text-[#b8c4c7]
                          group-hover:text-[#08B7C9]
                        "
                      />
                    </a>
                  );
                })}

                {!hasAnyLink && (
                  <div className="text-center py-5">
                    <p className="text-sm text-[#819399]">
                      Aucun lien renseigné.
                    </p>

                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="
                        mt-2
                        text-xs
                        font-semibold
                        text-[#08B7C9]
                        hover:text-[#079FB0]
                      "
                    >
                      Ajouter mes liens
                    </button>
                  </div>
                )}

              </div>
            </Section>

            <div
              className="
                rounded-2xl
                bg-[#123F4B]
                p-5
                text-white
                shadow-lg
                shadow-[#123F4B]/15
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      text-[#7ddce4]
                      uppercase
                      tracking-wider
                    "
                  >
                    Votre profil
                  </p>

                  <h3 className="text-lg font-bold mt-1">
                    {completion >= 80
                      ? "Excellent profil !"
                      : "Complétez votre profil"}
                  </h3>
                </div>

                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#08B7C9]/20
                    text-[#08B7C9]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Icon.check className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-white/65 mt-3 leading-5">
                {completion >= 80
                  ? "Votre profil contient suffisamment d'informations pour être présenté aux recruteurs."
                  : "Ajoutez davantage d'informations pour améliorer votre visibilité auprès des recruteurs."}
              </p>

              {completion < 100 && (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="
                    mt-4
                    w-full
                    py-2.5
                    rounded-xl
                    bg-[#08B7C9]
                    hover:bg-[#079FB0]
                    text-white
                    text-xs
                    font-bold
                    transition-colors
                  "
                >
                  Compléter mon profil
                </button>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  /* =========================================================
     GET PROFILE
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const res = await api.get("/me");

        if (mounted) {
          setStudent(res.data.student);
        }
      } catch (err) {
        console.error("Erreur récupération profil :", err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setStudent((previousStudent) => ({
      ...previousStudent,
      [name]: value,
    }));
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave = async () => {
    if (!student?.id) {
      setMessage("Erreur : profil étudiant introuvable.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        filiere: student.filiere,
        niveau: student.niveau,
        telephone: student.telephone,
        specialite: student.specialite,
        bio: student.bio,
        secteur_prefere: student.secteur_prefere,
        localisation_preferee: student.localisation_preferee,
        type_stage_prefere: student.type_stage_prefere,
        disponibilite_date: student.disponibilite_date,
        linkedin_url: student.linkedin_url,
        github_url: student.github_url,
        portfolio_url: student.portfolio_url,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") {
          payload[key] = null;
        }
      });

      await api.put(`/students/${student.id}`, payload);

      setMessage("Profil mis à jour avec succès.");
      setEditMode(false);
    } catch (err) {
      console.error(
        "Erreur mise à jour profil :",
        err.response?.data || err
      );

      setMessage(
        err.response?.data?.message ||
          "Erreur lors de la mise à jour."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CV UPLOAD
  ========================================================= */

  const handleCvUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !student?.id) {
      return;
    }

    if (file.type !== "application/pdf") {
      setMessage("Veuillez sélectionner un fichier PDF.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("cv", file);

    try {
      setMessage("");

      const res = await api.post(
        `/students/${student.id}/cv`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStudent((previousStudent) => ({
        ...previousStudent,
        cv_path: res.data.cv_path,
        cv_extracted: null,
      }));

      setMessage(
        "CV uploadé avec succès. Vous pouvez maintenant l'analyser avec l'IA."
      );
    } catch (err) {
      console.error(
        "Erreur upload CV :",
        err.response?.data || err
      );

      setMessage(
        err.response?.data?.message ||
          "Erreur lors de l'upload du CV."
      );
    } finally {
      event.target.value = "";
    }
  };

  /* =========================================================
     PHOTO UPLOAD
  ========================================================= */

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file || !student?.id) {
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      setMessage("");

      const res = await api.post(
        `/students/${student.id}/photo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setStudent((previousStudent) => ({
        ...previousStudent,
        photo_path: res.data.photo_path,
      }));

      setMessage("Photo mise à jour.");
    } catch (err) {
      console.error(
        "Erreur upload photo :",
        err.response?.data || err
      );

      setMessage(
        err.response?.data?.message ||
          "Erreur lors de l'upload de la photo."
      );
    } finally {
      event.target.value = "";
    }
  };

  /* =========================================================
     EXTRACT CV
  ========================================================= */

  const handleExtractCv = async () => {
    if (!student?.cv_path || !student?.id) {
      setMessage("Veuillez d'abord ajouter un CV.");
      return;
    }

    setExtracting(true);
    setMessage("");

    try {
      const res = await api.post(
        `/students/${student.id}/extract-cv`
      );

      setStudent((previousStudent) => ({
        ...previousStudent,
        cv_extracted: res.data.cv_extracted,
      }));

      setMessage("CV analysé avec succès.");
    } catch (err) {
      console.error(
        "Erreur extraction CV :",
        err.response?.data || err
      );

      setMessage(
        err.response?.data?.message ||
          "Erreur lors de l'analyse du CV."
      );
    } finally {
      setExtracting(false);
    }
  };

  /* =========================================================
     MEMOIZED VALUES
  ========================================================= */

  const completion = useMemo(
    () => getCompletion(student),
    [student]
  );

  const linkItems = useMemo(
    () => [
      {
        url: student?.linkedin_url,
        label: "LinkedIn",
        short: "in",
      },
      {
        url: student?.github_url,
        label: "GitHub",
        short: "GH",
      },
      {
        url: student?.portfolio_url,
        label: "Portfolio",
        short: "PF",
      },
    ],
    [
      student?.linkedin_url,
      student?.github_url,
      student?.portfolio_url,
    ]
  );

  const hasAnyLink = useMemo(
    () => linkItems.some((item) => Boolean(item.url)),
    [linkItems]
  );

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#f5f7f8] p-6">
        <div className="max-w-6xl mx-auto animate-pulse space-y-5">
          <div className="h-10 bg-[#e4edef] rounded-xl w-48" />

          <div className="h-64 bg-white rounded-2xl border border-[#e4edef]" />

          <div className="grid md:grid-cols-2 gap-5">
            <div className="h-56 bg-white rounded-2xl border border-[#e4edef]" />
            <div className="h-56 bg-white rounded-2xl border border-[#e4edef]" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     NO PROFILE
  ========================================================= */

  if (!student) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f5f7f8]">
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center shadow-[0_3px_15px_rgba(18,63,75,0.045)]">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <Icon.user className="w-6 h-6" />
          </div>

          <h2 className="font-semibold text-[#123F4B]">
            Profil introuvable
          </h2>

          <p className="text-sm text-[#819399] mt-1">
            Impossible de récupérer les informations du profil.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  if (editMode) {
    return (
      <StudentProfileEdit
        student={student}
        message={message}
        saving={saving}
        handleChange={handleChange}
        handleSave={handleSave}
        handleCvUpload={handleCvUpload}
        handlePhotoUpload={handlePhotoUpload}
        setEditMode={setEditMode}
      />
    );
  }

  return (
    <StudentProfileView
      student={student}
      message={message}
      completion={completion}
      linkItems={linkItems}
      hasAnyLink={hasAnyLink}
      handleExtractCv={handleExtractCv}
      extracting={extracting}
      setEditMode={setEditMode}
    />
  );
}