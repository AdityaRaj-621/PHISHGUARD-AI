import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// Non-lazy first-paint pages (§11 & §41)
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Lazy-loaded pages
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const MessageScannerPage = lazy(() => import('../pages/scanners/MessageScannerPage'));
const UrlScannerPage = lazy(() => import('../pages/scanners/UrlScannerPage'));
const EmailScannerPage = lazy(() => import('../pages/scanners/EmailScannerPage'));
const ScanHistoryPage = lazy(() => import('../pages/history/ScanHistoryPage'));
const ScanResultPage = lazy(() => import('../pages/result/ScanResultPage'));
const EducationPage = lazy(() => import('../pages/education/EducationPage'));
const EducationArticlePage = lazy(() => import('../pages/education/EducationArticlePage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const NotFoundPage = lazy(() => import('../pages/notfound/NotFoundPage'));

import LoadingState from '../components/feedback/LoadingState';

function RouteSkeleton() {
  return (
    <div style={{ padding: 'var(--space-6)', width: '100%', maxWidth: 'var(--content-max)', margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <LoadingState lines={2} height="28px" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <LoadingState lines={3} height="80px" />
        <LoadingState lines={3} height="80px" />
        <LoadingState lines={3} height="80px" />
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        {/* Public Marketing Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/education/:slug" element={<EducationArticlePage />} />
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected App Shell Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/scan/message" element={<MessageScannerPage />} />
            <Route path="/scan/url" element={<UrlScannerPage />} />
            <Route path="/scan/email" element={<EmailScannerPage />} />
            <Route path="/scans" element={<ScanHistoryPage />} />
            <Route path="/scans/:id" element={<ScanResultPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin only route */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>

        {/* 404 Route */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
