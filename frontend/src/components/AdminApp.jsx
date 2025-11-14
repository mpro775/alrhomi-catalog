// src/components/AdminApp.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ImageManagement from '../pages/admin/ImageManagement';
import UserManagement from '../pages/admin/UserManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import ProductManagement from '../pages/admin/ProductManagement';

export default function AdminApp() {
  return (
    <Routes>
      {/* نستخدم Layout كـ wrapper دون path هنا */}
      <Route element={<AdminLayout />}>
        {/* هذا هو /admin */}
        <Route index       element={<AdminDashboard />} />
        {/* هذا هو /admin/images */}
        <Route path="images" element={<ImageManagement />} />
        <Route path="products" element={<ProductManagement />} />
        {/* هذا هو /admin/users */}
        <Route path="users"  element={<UserManagement />} />
        <Route path="categories"  element={<CategoryManagement />} />
        {/* أي مسار آخر تحت /admin يقود للوحة القيادة */}
        <Route path="*"      element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
}
