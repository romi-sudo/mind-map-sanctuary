import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index.tsx";
import Questionnaire from "./pages/Questionnaire.tsx";
import Practitioners from "./pages/Practitioners.tsx";
import PractitionerProfile from "./pages/PractitionerProfile.tsx";
import JoinAsPractitioner from "./pages/JoinAsPractitioner.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import Approaches from "./pages/Approaches.tsx";
import CorporateWellness from "./pages/CorporateWellness.tsx";
import Pending from "./pages/Pending.tsx";
import NotFound from "./pages/NotFound.tsx";
import AmbientPlayer from "./components/AmbientPlayer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/practitioners" element={<Practitioners />} />
            <Route path="/approaches" element={<Approaches />} />
            <Route path="/practitioners/:id" element={<PractitionerProfile />} />
            <Route path="/corporate" element={<CorporateWellness />} />
            <Route path="/join-as-practitioner" element={<JoinAsPractitioner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pending" element={<Pending />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AmbientPlayer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
