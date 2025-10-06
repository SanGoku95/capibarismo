import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Header } from "./components/layout/Header";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { Analytics } from "@vercel/analytics/next"

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage").then(module => ({ default: module.HomePage })));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const CandidateProfile = lazy(() => import("./pages/CandidateProfile").then(module => ({ default: module.CandidateProfile })));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })));
const PoliticalCompassPage = lazy(() => import("./pages/PoliticalCompassPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Loading component for suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

// Move Suspense from around <Routes> to around <Outlet> so Header stays mounted
const AppLayout = () => (
  <>
    <Header />
    <main>
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </main>
  </>
);

const App = () => {
  // Prefetch common routes after idle to avoid first-click suspend
  useEffect(() => {
    const idle = 'requestIdleCallback' in window
      ? (window as any).requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 500);
    const cancel = 'cancelIdleCallback' in window
      ? (window as any).cancelIdleCallback
      : (id: number) => clearTimeout(id as any);

    const id = idle(async () => {
      try {
        await Promise.all([
          import("./pages/ComparePage"),
          import("./pages/PoliticalCompassPage"),
          import("./pages/About"),
          import("./pages/CandidateProfile"),
        ]);
      } catch {
        // ignore prefetch errors in dev
      }
    });

    return () => cancel(id);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/compare" element={<ComparePage />} />
                <Route path="/compass" element={<PoliticalCompassPage />} />
                <Route path="/candidate/:id" element={<CandidateProfile />} />
                <Route path="/about" element={<About />} />
              </Route>
              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        <Analytics />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
