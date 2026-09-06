import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute, PublicOnlyRoute } from './components/routing/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CandidatesProvider } from './context/CandidatesContext';
import { JobsProvider } from './context/JobsContext';
import { CandidateDetailPage } from './pages/CandidateDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { JobsPage } from './pages/JobsPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { WorkflowBuilderPage } from './pages/WorkflowBuilderPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <JobsProvider>
          <CandidatesProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:jobId" element={<JobDetailPage />} />
                <Route path="/jobs/:jobId/workflow" element={<WorkflowBuilderPage />} />
                <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
                <Route
                  path="/jobs/new"
                  element={<Navigate to="/jobs" replace state={{ openCreate: true }} />}
                />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          </CandidatesProvider>
        </JobsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
