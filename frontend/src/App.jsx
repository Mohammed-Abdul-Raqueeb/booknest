import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Browse from "./pages/Browse";
import BookDetails from "./pages/BookDetails";
import MyBorrowings from "./pages/MyBorrowings";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import HowBorrowingWorks from "./pages/resources/HowBorrowingWorks";
import ReadingGuides from "./pages/resources/ReadingGuides";
import HelpCenter from "./pages/resources/HelpCenter";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Student dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* /dashboard is an alias for /student */}
        <Route path="/dashboard" element={<Navigate to="/student" replace />} />

        {/* Student pages */}
        <Route
          path="/browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books/:id"
          element={
            <ProtectedRoute>
              <BookDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrowings"
          element={
            <ProtectedRoute>
              <MyBorrowings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookmarks"
          element={
            <ProtectedRoute>
              <Bookmarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Resources (informational — available to any logged-in student) */}
        <Route
          path="/resources/how-borrowing-works"
          element={
            <ProtectedRoute>
              <HowBorrowingWorks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/reading-guides"
          element={
            <ProtectedRoute>
              <ReadingGuides />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources/help"
          element={
            <ProtectedRoute>
              <HelpCenter />
            </ProtectedRoute>
          }
        />

        {/* Legal / support pages */}
        <Route
          path="/privacy"
          element={
            <ProtectedRoute>
              <Privacy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/terms"
          element={
            <ProtectedRoute>
              <Terms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
