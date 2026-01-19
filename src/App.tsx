import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InstallationProvider } from "./contexts/InstallationContext";
import { TourProvider } from "./contexts/TourContext";
import { TourOverlay } from "./components/tour/TourOverlay";
import { WelcomeModal } from "./components/tour/WelcomeModal";
import Index from "./pages/Index";
import TuketimAnalizi from "./pages/TuketimAnalizi";
import Faturalar from "./pages/Faturalar";
import ArizaDestek from "./pages/ArizaDestek";
import Tarifeler from "./pages/Tarifeler";
import Referans from "./pages/Referans";
import Onboarding from "./pages/Onboarding";
import Ipuclari from "./pages/Ipuclari";
import Profil from "./pages/Profil";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <InstallationProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TourProvider>
        <TourOverlay />
        <WelcomeModal />
        <Routes>
          <Route path="/giris" element={<Login />} />
          <Route path="/kayit" element={<Register />} />
          <Route path="/sifremi-unuttum" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<Index />} />
          <Route path="/tuketim-analizi" element={<TuketimAnalizi />} />
          <Route path="/faturalar" element={<Faturalar />} />
          <Route path="/ariza-destek" element={<ArizaDestek />} />
          <Route path="/tarifeler" element={<Tarifeler />} />
          <Route path="/referans" element={<Referans />} />
          <Route path="/ipuclari" element={<Ipuclari />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </TourProvider>
      </BrowserRouter>
    </TooltipProvider>
    </InstallationProvider>
  </QueryClientProvider>
);

export default App;