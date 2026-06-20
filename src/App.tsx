import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { LearnPage } from '@/pages/LearnPage';
import { SelfCheckPage } from '@/pages/SelfCheckPage';
import { RiskAssessmentPage } from '@/pages/RiskAssessmentPage';
import { ChatPage } from '@/pages/ChatPage';
import { ReminderPage } from '@/pages/ReminderPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Map page pulls in Leaflet — load it only when the route is visited.
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'));

function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <span
        className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500"
        aria-hidden
      />
    </div>
  );
}

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="self-check" element={<SelfCheckPage />} />
          <Route path="risk" element={<RiskAssessmentPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route
            path="doctors"
            element={
              <Suspense fallback={<RouteFallback />}>
                <DoctorsPage />
              </Suspense>
            }
          />
          <Route path="reminder" element={<ReminderPage />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
