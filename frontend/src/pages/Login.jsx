import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [animating, setAnimating] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // =========================================================
  // LOGIN
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // ANIMATION → REGISTER
  // =========================================================
  const goToRegister = () => {
    if (animating) return;

    setAnimating(true);

    setTimeout(() => {
      navigate("/register");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <div
        className={`
          relative
          w-full
          max-w-[850px]
          min-h-[500px]
          bg-white
          rounded-[25px]
          overflow-hidden
          shadow-[0_18px_50px_rgba(0,0,0,0.12)]

          transition-transform
          duration-[900ms]
          ease-[cubic-bezier(0.76,0,0.24,1)]

          ${animating ? "scale-[0.985]" : "scale-100"}
        `}
      >

        {/* =====================================================
            LOGIN FORM
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
            py-8

            z-10

            transition-all
            duration-[900ms]
            ease-[cubic-bezier(0.76,0,0.24,1)]

            ${
              animating
                ? "left-[-18%] opacity-0 scale-[0.92] blur-[3px]"
                : "left-[45%] opacity-100 scale-100 blur-0"
            }
          `}
        >
          <div className="w-full max-w-[350px]">

            {/* TITLE */}
            <h2 className="text-center text-[30px] font-bold text-[#111827] mb-5">
              Login
            </h2>

            {/* ERROR */}
            {error && (
              <div
                className="
                  mb-3
                  px-3
                  py-2
                  rounded-md
                  bg-red-50
                  border
                  border-red-200
                  text-red-600
                  text-[13px]
                "
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}
              <div className="relative mb-5">

                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="
                    w-full
                    h-[46px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    pr-12
                    text-[14px]
                    text-[#333]
                    placeholder-[#999]
                    focus:bg-[#e8e8e8]
                    transition
                  "
                />

                {/* USER ICON */}
                <div
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#222]
                  "
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />
                  </svg>
                </div>

              </div>

              {/* PASSWORD */}
              <div className="relative mb-3">

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
                    w-full
                    h-[46px]
                    bg-[#eeeeee]
                    border-none
                    outline-none
                    px-4
                    pr-12
                    text-[14px]
                    text-[#333]
                    placeholder-[#999]
                    focus:bg-[#e8e8e8]
                    transition
                  "
                />

                {/* LOCK ICON */}
                <div
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#222]
                  "
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17 8h-1V6a4 4 0 0 0-8 0v2H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-5 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2ZM10 8V6a2 2 0 1 1 4 0v2h-4Z" />
                  </svg>
                </div>

              </div>

              {/* FORGOT PASSWORD */}
              <div className="text-center mb-4">
                <span
                  className="
                    text-[13px]
                    text-[#333]
                    cursor-pointer
                    hover:text-[#08b7c9]
                    transition
                  "
                >
                  Forgot your password?
                </span>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={submitting}
                className="
                  w-full
                  h-[46px]
                  rounded-full
                  bg-gradient-to-r
                  from-[#123f4b]
                  via-[#08aebe]
                  to-[#0bc7d5]
                  text-white
                  font-semibold
                  text-[14px]
                  shadow-[0_5px_15px_rgba(0,0,0,0.14)]
                  hover:scale-[1.015]
                  active:scale-[0.98]
                  transition-all
                  duration-300
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >
                {submitting ? "Signing in..." : "Login"}
              </button>

            </form>

            {/* SOCIAL LOGIN */}
            <div className="text-center mt-4">

              <p className="text-[13px] text-[#555] mb-3">
                or continue with
              </p>

              <div className="flex items-center justify-center gap-3">

                {/* GOOGLE */}
                <div
                  className="
                    w-[48px]
                    h-[46px]
                    border
                    border-[#ddd]
                    flex
                    items-center
                    justify-center
                    bg-white
                    text-[21px]
                    font-bold
                    text-[#222]
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  G
                </div>

                {/* FACEBOOK */}
                <div
                  className="
                    w-[48px]
                    h-[46px]
                    border
                    border-[#ddd]
                    flex
                    items-center
                    justify-center
                    bg-white
                    text-[21px]
                    font-bold
                    text-[#222]
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  f
                </div>

                {/* KEYCLOAK */}
                <a
                  href="http://stage-platform.local:8000/auth/keycloak/redirect"
                  title="Sign in with Keycloak"
                  className="
                    w-[48px]
                    h-[46px]
                    border
                    border-[#ddd]
                    flex
                    items-center
                    justify-center
                    bg-white
                    text-[19px]
                    font-bold
                    text-[#222]
                    shadow-sm
                    hover:-translate-y-1
                    hover:border-[#08b7c9]
                    hover:text-[#08b7c9]
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  K
                </a>

                {/* LINKEDIN */}
                <div
                  className="
                    w-[48px]
                    h-[46px]
                    border
                    border-[#ddd]
                    flex
                    items-center
                    justify-center
                    bg-white
                    text-[19px]
                    font-bold
                    text-[#222]
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-md
                    transition-all
                    duration-300
                  "
                >
                  in
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* =====================================================
            TURQUOISE WELCOME PANEL
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
            duration-[900ms]
            ease-[cubic-bezier(0.76,0,0.24,1)]

            ${
              animating
                ? "left-[55%] scale-[1.04]"
                : "left-0 scale-100"
            }
          `}
          style={{
            borderTopRightRadius: "150px",
            borderBottomRightRadius: "150px",
          }}
        >

          {/* DECORATIVE CIRCLE 1 */}
          <div
            className={`
              absolute
              -left-[150px]
              -top-[100px]
              w-[400px]
              h-[400px]
              rounded-full
              bg-[#0bc2d1]
              opacity-60
              transition-transform
              duration-[1200ms]
              ease-out

              ${
                animating
                  ? "scale-[1.25] rotate-12"
                  : "scale-100"
              }
            `}
          />

          {/* DECORATIVE CIRCLE 2 */}
          <div
            className={`
              absolute
              -left-[100px]
              -bottom-[130px]
              w-[350px]
              h-[350px]
              rounded-full
              bg-[#10cbd8]
              opacity-50
              transition-transform
              duration-[1200ms]
              ease-out

              ${
                animating
                  ? "scale-[1.2] -rotate-12"
                  : "scale-100"
              }
            `}
          />

          {/* WELCOME CONTENT */}
          <div
            className={`
              relative
              z-10
              text-center
              px-7

              transition-all
              duration-[750ms]
              ease-out

              ${
                animating
                  ? "opacity-0 scale-[0.72] translate-x-[45px] blur-[5px]"
                  : "opacity-100 scale-100 translate-x-0 blur-0"
              }
            `}
          >

            <h1 className="text-[30px] font-bold tracking-tight mb-3">
              Welcome!
            </h1>

            <p className="text-[14px] leading-6 text-white/95 mb-1">
              Your dedicated space to manage
            </p>

            <p className="text-[14px] leading-6 text-white/95 mb-6">
              and track your internships.
            </p>

            {/* REGISTER BUTTON */}
            <button
              type="button"
              onClick={goToRegister}
              disabled={animating}
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
                hover:scale-105

                active:scale-95

                transition-all
                duration-300

                disabled:opacity-70
                disabled:cursor-default
              "
            >
              Create an account
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}