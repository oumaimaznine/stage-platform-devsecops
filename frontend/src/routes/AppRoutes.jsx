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
import StudentProfile from "../pages/StudentProfile";
import KeycloakCallback from "../pages/KeycloakCallback";
import Recommendations from "../pages/Recommendations";
import Favorites from "../pages/Favorites";

/* =========================================================
   PRIVATE ROUTE
========================================================= */

function PrivateRoute({ title, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout title={title}>{children}</Layout>;
}

/* =========================================================
   PUBLIC ONLY ROUTE
========================================================= */

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-6">Chargement...</p>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/* =========================================================
   ROUTES
========================================================= */

function RoutesInner() {
  return (
    <Routes>
      {/* =====================================================
          AUTHENTIFICATION
      ===================================================== */}

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

      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <Route
        path="/dashboard"
        element={
          <PrivateRoute title="Tableau de bord">
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          OFFRES
      ===================================================== */}

      <Route
        path="/offers"
        element={
          <PrivateRoute title="Offres">
            <Offers />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          RECOMMANDATIONS IA
      ===================================================== */}

      <Route
        path="/recommendations"
        element={
          <PrivateRoute title="Recommandations IA">
            <Recommendations />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          ENTREPRISES
      ===================================================== */}

      <Route
        path="/companies"
        element={
          <PrivateRoute title="Entreprises">
            <Companies />
          </PrivateRoute>
        }
      />
      <Route path="/favorites" element={<Favorites />} />

      {/* =====================================================
          ETUDIANTS
      ===================================================== */}

      <Route
        path="/students"
        element={
          <PrivateRoute title="Etudiants">
            <Students />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          CANDIDATURES
      ===================================================== */}

      <Route
        path="/applications"
        element={
          <PrivateRoute title="Candidatures">
            <Applications />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          ENTRETIENS
      ===================================================== */}

      <Route
        path="/entretiens"
        element={
          <PrivateRoute title="Entretiens">
            <Entretiens />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          CONVENTIONS
      ===================================================== */}

      <Route
        path="/conventions"
        element={
          <PrivateRoute title="Conventions">
            <Conventions />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          RAPPORTS
      ===================================================== */}

      <Route
        path="/reports"
        element={
          <PrivateRoute title="Rapports">
            <Reports />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          MESSAGES
      ===================================================== */}

      <Route
        path="/messages"
        element={
          <PrivateRoute title="Messages">
            <Messages />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          ASSISTANT IA
      ===================================================== */}

      <Route
        path="/assistant"
        element={
          <PrivateRoute title="Assistant IA">
            <AssistantIA />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          PROFIL
      ===================================================== */}

      <Route
        path="/profile"
        element={
          <PrivateRoute title="Mon profil">
            <StudentProfile />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          ADMIN
      ===================================================== */}

      <Route
        path="/admin/validation"
        element={
          <PrivateRoute title="Validation">
            <AdminValidation />
          </PrivateRoute>
        }
      />

      {/* =====================================================
          KEYCLOAK
      ===================================================== */}

      <Route
        path="/auth/callback"
        element={<KeycloakCallback />}
      />

      {/* =====================================================
          DEFAULT
      ===================================================== */}

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

/* =========================================================
   APP ROUTES
========================================================= */

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesInner />
      </AuthProvider>
    </BrowserRouter>
  );
}