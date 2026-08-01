import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/me")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };
  const register = async (payload) => {
    const res = await api.post("/register", payload);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };
  const loginWithToken = async (token) => {
    localStorage.setItem("token", token);
    const res = await api.get("/me");
    setUser(res.data);
  };
  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };
  return (
    <AuthContext.Provider value={{ user, login, register, loginWithToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);