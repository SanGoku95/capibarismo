import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import ComparePage from "./pages/ComparePage";
import { CandidateProfile } from "./pages/CandidateProfile";
import NotFound from "./pages/NotFound";
import { About } from "./pages/About";
import { Header } from "./components/Header";
import DebatePage  from "./pages/Debate";
import News from "./pages/News";
import EventDetail from './pages/EventDetail';
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();

const AppLayout = () => (
  <>
    <Header />
    <main>
      <Outlet />
    </main>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<EventDetail />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/candidate/:id" element={<CandidateProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/debate" element={<DebatePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
