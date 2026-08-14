import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "etudiant",
    filiere: "",
    niveau: "",
    nom_entreprise: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [animating, setAnimating] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        "Erreur lors de l'inscription";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const goToLogin = () => {
    setAnimating(true);

    setTimeout(() => {
      navigate("/login");
    }, 650);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">

      <div
        className={`
          relative
          w-full
          max-w-[850px]
          min-h-[500px]
          bg-white
          rounded-[25px]
          overflow-hidden
          shadow-[0_12px_35px_rgba(0,0,0,0.10)]
          flex
          transition-all
          duration-700
          ${animating ? "scale-[0.98]" : "scale-100"}
        `}
      >

        {/* =====================================================
            REGISTER FORM
        ====================================================== */}
        <div
          className={`
            absolute
            top-0
            h-full
            w-[55%]
            flex
            items-center
            justify-center
            bg-white
            px-10
            py-7
            z-10
            transition-all
            duration-700
            ease-in-out
            ${animating ? "left-[100%] opacity-0" : "left-0 opacity-100"}
          `}
        >

          <div className="w-full max-w-[350px]">

            <h2 className="text-center text-[30px] font-bold text-[#111827] mb-4">
              Register
            </h2>

            {error && (
              <div className="mb-3 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-600 text-[12px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* ROLE */}
              <div className="relative mb-3">

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="
                    w-full
                    h-[42px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    text-[13px]
                    text-[#333]
                    appearance-none
                    cursor-pointer
                  "
                >
                  <option value="etudiant">
                    Étudiant
                  </option>

                  <option value="entreprise">
                    Entreprise
                  </option>
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none">
                  ▼
                </div>

              </div>

              {/* NOM */}
              <div className="relative mb-3">

                <input
                  name="name"
                  placeholder="Nom complet"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-[42px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    pr-11
                    text-[13px]
                    text-[#333]
                    placeholder-[#999]
                    focus:bg-[#e8e8e8]
                  "
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#222]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />
                  </svg>
                </div>

              </div>

              {/* EMAIL */}
              <div className="relative mb-3">

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-[42px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    pr-11
                    text-[13px]
                    text-[#333]
                    placeholder-[#999]
                    focus:bg-[#e8e8e8]
                  "
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#222]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
                  </svg>
                </div>

              </div>

              {/* PASSWORD */}
              <div className="relative mb-3">

                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-[42px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    pr-11
                    text-[13px]
                    text-[#333]
                    placeholder-[#999]
                    focus:bg-[#e8e8e8]
                  "
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#222]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-5 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2ZM10 8V6a2 2 0 1 1 4 0v2h-4Z" />
                  </svg>
                </div>

              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative mb-3">

                <input
                  type="password"
                  name="password_confirmation"
                  placeholder="Confirmer le mot de passe"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    h-[42px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    pr-11
                    text-[13px]
                    text-[#333]
                    placeholder-[#999]
                    focus:bg-[#e8e8e8]
                  "
                />

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#222]">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6-6h-1V8a5 5 0 0 0-10 0v3H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2Zm-9-3a3 3 0 1 1 6 0v3H9V8Z" />
                  </svg>
                </div>

              </div>

              {/* ETUDIANT */}
              {form.role === "etudiant" && (
                <div className="grid grid-cols-2 gap-3">

                  <input
                    name="filiere"
                    placeholder="Filière"
                    value={form.filiere}
                    onChange={handleChange}
                    className="
                      w-full
                      h-[42px]
                      bg-[#eeeeee]
                      border-none
                      outline-none
                      px-4
                      text-[13px]
                      text-[#333]
                      placeholder-[#999]
                      focus:bg-[#e8e8e8]
                    "
                  />

                  <input
                    name="niveau"
                    placeholder="Niveau"
                    value={form.niveau}
                    onChange={handleChange}
                    className="
                      w-full
                      h-[42px]
                      bg-[#eeeeee]
                      border-none
                      outline-none
                      px-4
                      text-[13px]
                      text-[#333]
                      placeholder-[#999]
                      focus:bg-[#e8e8e8]
                    "
                  />

                </div>
              )}

              {/* ENTREPRISE */}
              {form.role === "entreprise" && (
                <input
                  name="nom_entreprise"
                  placeholder="Nom de l'entreprise"
                  value={form.nom_entreprise}
                  onChange={handleChange}
                  className="
                    w-full
                    h-[42px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    text-[13px]
                    text-[#333]
                    placeholder-[#999]
                    focus:bg-[#e8e8e8]
                  "
                />
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="
                  w-full
                  h-[44px]
                  mt-4
                  rounded-full
                  bg-gradient-to-r
                  from-[#123f4b]
                  via-[#08aebe]
                  to-[#0bc7d5]
                  text-white
                  font-semibold
                  text-[14px]
                  shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                  hover:scale-[1.01]
                  transition-all
                  duration-300
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {submitting ? "Création..." : "Register"}
              </button>

            </form>

          </div>
        </div>

        {/* =====================================================
            TURQUOISE PANEL
        ====================================================== */}
        <div
          className={`
            absolute
            top-0
            h-full
            w-[45%]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-[#11c7d7]
            to-[#08b7c9]
            text-white
            z-20
            transition-all
            duration-700
            ease-in-out
            ${animating ? "left-0" : "left-[55%]"}
          `}
          style={{
            borderTopLeftRadius: "150px",
            borderBottomLeftRadius: "150px",
          }}
        >

          <div
            className="
              absolute
              -right-[150px]
              -top-[100px]
              w-[400px]
              h-[400px]
              rounded-full
              bg-[#0bc2d1]
              opacity-60
            "
          />

          <div
            className="
              absolute
              -right-[100px]
              -bottom-[130px]
              w-[350px]
              h-[350px]
              rounded-full
              bg-[#10cbd8]
              opacity-50
            "
          />

          <div
            className={`
              relative
              z-10
              text-center
              px-6
              transition-all
              duration-500
              ${animating ? "opacity-0 scale-90" : "opacity-100 scale-100"}
            `}
          >

            <h1 className="text-[30px] font-bold tracking-tight mb-2">
              Welcome Back!
            </h1>

            <p className="text-[13px] text-white/95 mb-5">
              Already have an Account?
            </p>

            <button
              onClick={goToLogin}
              className="
                inline-flex
                items-center
                justify-center
                px-8
                py-2.5
                rounded-full
                border-2
                border-white
                text-white
                font-semibold
                text-[13px]
                hover:bg-white
                hover:text-[#08b7c9]
                transition-all
                duration-300
              "
            >
              Login
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}