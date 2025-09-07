import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import SheetUpload from "./pages/SheetUpload.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import "./index.css";
import Loader from "./components/Loader.jsx";

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return <Loader />;
  return user ? children : <Navigate to="/login" replace />;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <div className="dark">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <SheetUpload />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  </StrictMode>
);