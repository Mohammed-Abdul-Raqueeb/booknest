import { Navigate } from "react-router-dom";

/**
 * Wrap any route element that requires a logged-in user.
 * Reads the same "student" key that Login.jsx writes to localStorage.
 *
 * Usage:
 *   <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
 *   <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children, role }) {
  const stored = localStorage.getItem("student");

  if (!stored) {
    return <Navigate to="/" replace />;
  }

  if (role) {
    let user = null;
    try {
      user = JSON.parse(stored);
    } catch {
      return <Navigate to="/" replace />;
    }

    if (user?.role !== role) {
      // Logged in, but as the wrong kind of account — send them somewhere valid
      // instead of an access-denied dead end.
      return <Navigate to={user?.role === "ADMIN" ? "/admin" : "/student"} replace />;
    }
  }

  return children;
}
