import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Contestants from "./pages/Contestants";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import FixedLogo from "./components/FixedLogo";

// Import admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContestants from "./pages/admin/AdminContestants";
import AdminPosters from "./pages/admin/AdminPosters";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRegistrations from "./pages/admin/AdminRegistrations";
import AdminMessages from "./pages/admin/AdminMessages";

const queryClient = new QueryClient();

// Protected route component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <FixedLogo />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/contestants" element={<Contestants />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Admin routes with protection */}
              <Route path="/admin" element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/contestants" element={
                <ProtectedAdminRoute>
                  <AdminContestants />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/posters" element={
                <ProtectedAdminRoute>
                  <AdminPosters />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedAdminRoute>
                  <AdminSettings />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/registrations" element={
                <ProtectedAdminRoute>
                  <AdminRegistrations />
                </ProtectedAdminRoute>
              } />
              <Route path="/admin/messages" element={
                <ProtectedAdminRoute>
                  <AdminMessages />
                </ProtectedAdminRoute>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
