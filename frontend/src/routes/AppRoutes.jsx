import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Offers from "../pages/Offers";
import Companies from "../pages/Companies";
import Students from "../pages/Students";
import Applications from "../pages/Applications";
import Entretiens from "../pages/Entretiens";
import Conventions from "../pages/Conventions";
import Reports from "../pages/Reports";
import AdminValidation from "../pages/AdminValidation";
import Messages from "../pages/Messages";
import AssistantIA from "../pages/AssistantIA";

function PrivateRoute({ title, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-6">Chargement...</p>;
  if (!user) return <Navigate to="/login" />;
  return <Layout title={title}>{children}</Layout>;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-6">Chargement...</p>;
  if (user) return <Navigate to="/dashboard" />;
  return children;
}

function RoutesInner() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route path="/dashboard" element={<PrivateRoute title="Tableau de bord"><Dashboard /></PrivateRoute>} />
      <Route path="/offers" element={<PrivateRoute title="Offres"><Offers /></PrivateRoute>} />
      <Route path="/companies" element={<PrivateRoute title="Entreprises"><Companies /></PrivateRoute>} />
      <Route path="/students" element={<PrivateRoute title="Étudiants"><Students /></PrivateRoute>} />
      <Route path="/applications" element={<PrivateRoute title="Candidatures"><Applications /></PrivateRoute>} />
      <Route path="/entretiens" element={<PrivateRoute title="Entretiens"><Entretiens /></PrivateRoute>} />
      <Route path="/conventions" element={<PrivateRoute title="Conventions"><Conventions /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute title="Rapports"><Reports /></PrivateRoute>} />
      <Route path="/messages" element={<PrivateRoute title="Messages"><Messages /></PrivateRoute>} />
      <Route path="/assistant" element={<PrivateRoute title="Assistant IA"><AssistantIA /></PrivateRoute>} />
      <Route path="/admin/validation" element={<PrivateRoute title="Validation"><AdminValidation /></PrivateRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesInner />
      </AuthProvider>
    </BrowserRouter>
  );
}