import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme';

import AppErrorBoundary from './components/Error/AppErrorBoundary';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import AdminDashboard from './components/Admin/AdminDashboard';
import InvestorDashboard from './components/Investor/InvestorDashboard';
import InvestorDashboardContent from './components/Investor/InvestorDashboardContent';
import UserManagement from './components/Admin/UserManagement';
import UserDetailPage from './components/Admin/UserDetailPage';
import InvestmentManagement from './components/Investor/InvestmentManagement';
import InvestmentDetail from './components/Investments/InvestmentDetail';
import AssignmentManagement from './components/Investments/AssignmentManagement';
import InvestmentRequest from './components/Investor/InvestmentRequest';
import AdminRequestsPage from './components/Admin/AdminRequestsPage';

import WebsiteRoutes from './website/routes/WebsiteRoutes';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AxiosProvider } from './contexts/AxiosProvider';

// Route Guards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { auth } = useAuth();
  return auth ? <Navigate to="/" replace /> : children;
};

const AppContent = () => {
  const { auth } = useAuth();

  return (
    <AppErrorBoundary>
      <CssBaseline />
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users">
            <Route index element={<UserManagement />} />
            <Route path=":id" element={<UserDetailPage />} />
          </Route>
          <Route path="investments">
            <Route index element={<InvestmentManagement />} />
            <Route path=":id" element={<InvestmentDetail />} />
          </Route>
          <Route path="assignments" element={<AssignmentManagement />} />
          <Route path="requests" element={<AdminRequestsPage />} />
        </Route>

        {/* Investor Routes */}
        <Route path="/investor" element={
          <ProtectedRoute allowedRoles={['investor']}>
            <InvestorDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InvestorDashboardContent />} />
          <Route path="portfolio" element={<InvestmentManagement />} />
          <Route path="request" element={<InvestmentRequest />} />
        </Route>

        {/* Website Routes (default/fallback) */}
        <Route path="/" element={
          auth?.user?.role === 'admin'
            ? <Navigate to="/admin/dashboard" replace />
            : auth?.user?.role === 'investor'
              ? <Navigate to="/investor/dashboard" replace />
              : <WebsiteRoutes />
        } />

        {/* Everything else falls back to the website */}
        <Route path="*" element={<WebsiteRoutes />} />
      </Routes>
    </AppErrorBoundary>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        preventDuplicate
        dense
      >
        <BrowserRouter>
          <AuthProvider>
            <AxiosProvider>
              <AppContent />
            </AxiosProvider>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
