import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children, mode }) {
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const handleSwitch = () => {
    if (isLogin) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">

      <div
        className="
          relative
          w-full
          max-w-[850px]
          min-h-[500px]
          bg-white
          rounded-[25px]
          overflow-hidden
          shadow-[0_12px_35px_rgba(0,0,0,0.10)]
          flex
        "
      >

        {/* ==============================
            FORMULAIRE
        =============================== */}
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
            transition-all
            duration-700
            ease-in-out
            z-10

            ${
              isLogin
                ? "left-[45%]"
                : "left-0"
            }
          `}
        >
          <div className="w-full max-w-[350px]">
            {children}
          </div>
        </div>

        {/* ==============================
            PANNEAU TURQUOISE
        =============================== */}
        <div
          className={`
            absolute
            top-0
            h-full
            w-[55%]
            flex
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-[#11c7d7]
            to-[#08b7c9]
            text-white
            transition-all
            duration-700
            ease-in-out
            z-20

            ${
              isLogin
                ? "left-0 rounded-r-[150px]"
                : "left-[45%] rounded-l-[150px]"
            }
          `}
        >

          {/* Décoration */}
          <div
            className="
              absolute
              -left-[150px]
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
              -left-[100px]
              -bottom-[130px]
              w-[350px]
              h-[350px]
              rounded-full
              bg-[#10cbd8]
              opacity-50
            "
          />

          {/* Texte */}
          <div
            key={mode}
            className="
              relative
              z-10
              text-center
              px-6
              animate-[authFade_0.6s_ease]
            "
          >

            {isLogin ? (
              <>
                <h1 className="text-[30px] font-bold mb-2">
                  Hello, Welcome
                </h1>

                <p className="text-[13px] text-white/95 mb-5">
                  Don't have an Account
                </p>

                <button
                  onClick={handleSwitch}
                  className="
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
                  Register
                </button>
              </>
            ) : (
              <>
                <h1 className="text-[30px] font-bold mb-2">
                  Welcome Back!
                </h1>

                <p className="text-[13px] text-white/95 mb-5">
                  Already have an Account?
                </p>

                <button
                  onClick={handleSwitch}
                  className="
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
              </>
            )}

          </div>
        </div>

      </div>

      <style>
        {`
          @keyframes authFade {
            from {
              opacity: 0;
              transform: translateY(15px) scale(0.96);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

    </div>
  );
}