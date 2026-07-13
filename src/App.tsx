import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useTheme } from '@/hooks/useTheme';
import { REMINDER_STORAGE_KEY, scheduleNotificationCheck } from '@/utils/notificationScheduler';
import { HomePage } from '@/pages/HomePage';
import { LearnPage } from '@/pages/LearnPage';
import { SignsPage } from '@/pages/SignsPage';
import { WhenToSeekHelpPage } from '@/pages/WhenToSeekHelpPage';
import { SelfCheckPage } from '@/pages/SelfCheckPage';
import { RiskAssessmentPage } from '@/pages/RiskAssessmentPage';
import { RiskFactorsPage } from '@/pages/RiskFactorsPage';
import { ChatPage } from '@/pages/ChatPage';
import { CompanionPage } from '@/pages/CompanionPage';
import { ReminderPage } from '@/pages/ReminderPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Map page pulls in MapLibre — load it only when the route is visited.
const DoctorsPage = lazy(() => import('@/pages/DoctorsPage'));

// Design-system preview. Unlisted, lazy — never in the main bundle.
const DesignSystemPage = lazy(() => import('@/pages/DesignSystemPage'));

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
  // Owns the `.dark` class on <html> for the whole app.
  useTheme();

  // Resume a saved monthly reminder on load so an open tab can still fire it.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (saved) {
        const reminder = JSON.parse(saved);
        if (reminder?.isActive) scheduleNotificationCheck(reminder);
      }
    } catch {
      /* ignore corrupt/unavailable storage */
    }
  }, []);

  return (
    /* reducedMotion="user" is the MANDATORY guarantee, and it belongs here
       rather than in each component: framer now drops every transform and
       layout animation app-wide when the OS asks for reduced motion, and keeps
       only the opacity fade. Nothing has to remember, and nothing new can
       forget. The two things it cannot reach are guarded at source — CSS
       keyframes by the `motion-safe:` prefix and the media query in index.css,
       and scroll-linked parallax inside useParallax(). */
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <Routes>
        {/* Outside Layout: the preview owns its own chrome and theme toggle. */}
        <Route
          path="/design-system"
          element={
            <Suspense fallback={<RouteFallback />}>
              <DesignSystemPage />
            </Suspense>
          }
        />
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="signs" element={<SignsPage />} />
          <Route path="when-to-seek-help" element={<WhenToSeekHelpPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="self-check" element={<SelfCheckPage />} />
          <Route path="risk-factors" element={<RiskFactorsPage />} />
          <Route path="risk" element={<RiskAssessmentPage />} />
          <Route path="companion" element={<CompanionPage />} />
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
    </MotionConfig>
  );
}
