import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TuketimAnalizi from "./pages/TuketimAnalizi";
import Faturalar from "./pages/Faturalar";
import ArizaDestek from "./pages/ArizaDestek";
import Tarifeler from "./pages/Tarifeler";
import Referans from "./pages/Referans";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Index />} />
          <Route path="/tuketim-analizi" element={<TuketimAnalizi />} />
          <Route path="/faturalar" element={<Faturalar />} />
          <Route path="/ariza-destek" element={<ArizaDestek />} />
          <Route path="/tarifeler" element={<Tarifeler />} />
          <Route path="/referans" element={<Referans />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;