import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { ServiceRecordsPage } from './pages/ServiceRecordsPage';
import { ServiceSchedulesPage } from './pages/ServiceSchedulesPage';
import { OdometerLogsPage } from './pages/OdometerLogsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AdminDashboardPage, AdminMaintenanceItemsPage, AdminServiceTemplatesPage, AdminUsersPage } from './pages/AdminPages';
import { ProfilePage } from './pages/ProfilePage';
import { ThemeProvider } from './theme/ThemeContext';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/vehicles', element: <VehiclesPage /> },
          { path: '/vehicles/:id', element: <VehicleDetailPage /> },
          { path: '/service-records', element: <ServiceRecordsPage /> },
          { path: '/service-schedules', element: <ServiceSchedulesPage /> },
          { path: '/odometer-logs', element: <OdometerLogsPage /> },
          { path: '/documents', element: <DocumentsPage /> },
          { path: '/workshops', element: <WorkshopsPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute role="ADMIN" />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/admin', element: <AdminDashboardPage /> },
          { path: '/admin/users', element: <AdminUsersPage /> },
          { path: '/admin/maintenance-items', element: <AdminMaintenanceItemsPage /> },
          { path: '/admin/service-templates', element: <AdminServiceTemplatesPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
