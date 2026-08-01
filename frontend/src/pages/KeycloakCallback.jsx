import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function KeycloakCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    alert("KeycloakCallback monte, token = " + searchParams.get("token"));
    if (ran.current) return;
    ran.current = true;

    const token = searchParams.get("token");
    if (!token) {
      alert("Pas de token");
      navigate("/login");
      return;
    }

    loginWithToken(token)
      .then(() => {
        alert("loginWithToken reussi");
        navigate("/dashboard");
      })
      .catch((err) => {
        alert("Erreur loginWithToken: " + err.message);
        navigate("/login");
      });
  }, []);

  return <p>Connexion en cours...</p>;
}