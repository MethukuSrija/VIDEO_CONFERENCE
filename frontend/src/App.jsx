import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { MeetingProvider } from "./context/MeetingContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MeetingHistory from "./pages/MeetingHistory";
import MeetingDetails from "./pages/MeetingDetails";
import RoomPage from "./pages/RoomPage";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <MeetingProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings"
              element={
                <ProtectedRoute>
                  <MeetingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meetings/:roomId"
              element={
                <ProtectedRoute>
                  <MeetingDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room/:roomId"
              element={
                <ProtectedRoute>
                  <RoomPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MeetingProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
