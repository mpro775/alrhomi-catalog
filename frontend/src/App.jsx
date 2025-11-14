// src/App.jsx
import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CatalogPage from "./pages/CatalogPage";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import AdminApp from "./components/AdminApp";
import MainLayout from "./components/layout/MainLayout";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { accessToken, role: userRole } = useContext(AuthContext);

  const getDefaultRoute = () => {
    if (accessToken && userRole === "admin") return "/admin";
    return "/";
  };

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin/*"
        element={
          accessToken && userRole === "admin" ? (
            <AdminApp />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

export default App;
