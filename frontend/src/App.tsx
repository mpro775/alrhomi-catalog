// src/App.tsx
import React, { JSX, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";

const MainLayout = React.lazy(() => import("./components/layout/MainLayout"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const CatalogPage = React.lazy(() => import("./pages/CatalogPage"));
const HomePage = React.lazy(() => import("./pages/HomePage"));
const CategoriesPage = React.lazy(() => import("./pages/CategoriesPage"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const AdminApp = React.lazy(() => import("./components/AdminApp"));

const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const RouteProgress = React.lazy(() => import("./components/RouteProgress"));

const FullPageLoader = () => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
    </Box>
);

function App(): JSX.Element {
    const { accessToken, role: userRole } = useAuth();

    return (
        <Suspense fallback={<FullPageLoader />}>
            <div className="app-bg" />
            <RouteProgress />
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="catalog" element={<CatalogPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
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
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}

export default App;
