import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleGuard, GuestGuard } from "@/components/auth/RoleGuard";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import LeadsManagement from "./pages/admin/LeadsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<GuestGuard><Login /></GuestGuard>} />
            <Route path="/signup" element={<GuestGuard><Signup /></GuestGuard>} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="/admin/leads" element={<RoleGuard allowedRoles={['ADMIN']}><LeadsManagement /></RoleGuard>} />
            <Route path="/admin/users" element={<RoleGuard allowedRoles={['ADMIN']}><UsersManagement /></RoleGuard>} />
            <Route path="/admin/projects" element={<RoleGuard allowedRoles={['ADMIN']}><ProjectsManagement /></RoleGuard>} />
            
            {/* Staff Routes */}
            <Route path="/staff" element={<RoleGuard allowedRoles={['STAFF']}><StaffDashboard /></RoleGuard>} />
            
            {/* Client Routes */}
            <Route path="/client" element={<RoleGuard allowedRoles={['CLIENT']}><ClientDashboard /></RoleGuard>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
