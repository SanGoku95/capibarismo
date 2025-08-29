import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Header } from "./components/layout/Header";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage").then(module => ({ default: module.HomePage })));
const ComparePage = lazy(() => import("./pages/ComparePage"));
const CandidateProfile = lazy(() => import("./pages/CandidateProfile").then(module => ({ default: module.CandidateProfile })));
const NotFound = lazy(() => import("./pages/NotFound"));
const About = lazy(() => import("./pages/About").then(module => ({ default: module.About })));
const News = lazy(() => import("./pages/News"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
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

const AppLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/news/:slug" element={<EventDetail />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/compass" element={<PoliticalCompassPage />} />
                  <Route path="/candidate/:id" element={<CandidateProfile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Route>
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
