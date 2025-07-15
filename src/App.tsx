import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navigation } from "./components/Navigation";
import DoctorNav from "./components/DoctorNav";
import { HomePage } from "./components/pages/HomePage";
import WelcomePage from "./components/pages/WelcomePage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { AppointmentsPage } from "./components/pages/AppointmentsPage";
import { HealthTipsPage } from "./components/pages/HealthTipsPage";
import { NotificationsPage } from "./components/pages/NotificationsPage";
import RemindersPage from "./components/pages/RemindersPage";
import { AISupportPage } from "./components/pages/AISupportPage";
import QRCode from "./components/pages/QRCode";
import Videos from "./components/pages/videos";
import LocationFinder from "./components/pages/Locationfinder";
import RegisterPage from "./components/pages/RegisterPage";
import { LoginPage } from "./components/pages/LoginPage";
import DoctorDashboard from "./components/pages/DoctorDashboard";
import DoctorPatients from "./screens/DoctorPatients";
import DoctorAppointments from "./screens/DoctorAppointments";
import DoctorChat from "./screens/DoctorChat";
import DoctorAlerts from "./screens/DoctorAlerts";
import DoctorContent from "./screens/DoctorContent";
import DoctorSymptoms from "./screens/DoctorSymptoms";
import DoctorAnalytics from "./screens/DoctorAnalytics";
import DoctorMap from "./screens/DoctorMap";
import DoctorSettings from "./screens/DoctorSettings";
import ChatRealtimePage from "./components/pages/ChatRealtimePage";

import "./i18n/config";
import NotFound from "./pages/NotFound";
import BackButton from "./components/ui/BackButton";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  const location = window.location.pathname;
  const hideNavRoutes = ['/', '/login', '/register'];
  const showDoctorNav = isAuthenticated && user?.role === 'doctor' && location.startsWith('/doctor-dashboard');
  const showMotherNav = isAuthenticated && user?.role === 'mother' && !hideNavRoutes.includes(location) && !location.startsWith('/doctor-dashboard');
  const showBackButton = location !== '/login';
  const isDoctorRoute = location.startsWith('/doctor-dashboard');
  const hideBgRoutes = ['/', '/login', '/register', '/locationfinder', '/videos'];
  const showDynamicBg = !isDoctorRoute && !hideBgRoutes.includes(location);

  const bgImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=1500&q=80'
  ];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [showDynamicBg]);

  const isMother = user?.role === 'mother';
  const isDoctor = user?.role === 'doctor';

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors relative overflow-x-hidden">
          {showDynamicBg && (
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
              {bgImages.map((img, idx) => (
                <div
                  key={img}
                  className={`absolute inset-0 bg-cover bg-center filter blur-sm brightness-75 transition-opacity duration-1000 ${bgIndex === idx ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url('${img}')` }}
                />
              ))}
            </div>
          )}
          <div className="fixed top-4 right-4 z-50">
            <BackButton />
          </div>
          {showDoctorNav && <DoctorNav />}
          {showMotherNav && <Navigation />}
          <div className="relative z-10">
            <Routes>
              <Route path="/register" element={isAuthenticated ? <Navigate to={user?.role === 'doctor' ? '/doctor-dashboard' : '/home'} replace /> : <RegisterPage />} />
              <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'doctor' ? '/doctor-dashboard' : '/home'} replace /> : <LoginPage />} />
              <Route path="/" element={isAuthenticated ? <Navigate to={user?.role === 'doctor' ? '/doctor-dashboard' : '/home'} replace /> : <WelcomePage />} />
              {/* Mother-only routes */}
              <Route path="/home" element={isMother ? <HomePage /> : <NotFound />} />
              <Route path="/profile" element={isMother ? <ProfilePage /> : <NotFound />} />
              <Route path="/appointments" element={isMother ? <AppointmentsPage /> : <NotFound />} />
              <Route path="/health-tips" element={isMother ? <HealthTipsPage /> : <NotFound />} />
              <Route path="/reminders" element={isMother ? <RemindersPage /> : <NotFound />} />
              <Route path="/ai-support" element={isMother ? <AISupportPage /> : <NotFound />} />
              <Route path="/notifications" element={isMother ? <NotificationsPage /> : <NotFound />} />
              <Route path="/qrcode" element={isMother ? <QRCode /> : <NotFound />} />
              <Route path="/videos" element={isMother ? <Videos /> : <NotFound />} />
              <Route path="/locationfinder" element={isMother ? <LocationFinder /> : <NotFound />} />
              {/* Doctor-only routes with nested pages */}
              <Route path="/doctor-dashboard" element={isDoctor ? <DoctorDashboard /> : <NotFound />}>
                <Route path="patients" element={<DoctorPatients />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="chat" element={<DoctorChat />} />
                <Route path="alerts" element={<DoctorAlerts />} />
                <Route path="content" element={<DoctorContent />} />
                <Route path="symptoms" element={<DoctorSymptoms />} />
                <Route path="analytics" element={<DoctorAnalytics />} />
                <Route path="map" element={<DoctorMap />} />
                <Route path="settings" element={<DoctorSettings />} />
                <Route path="reminders" element={<RemindersPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="health-tips" element={<HealthTipsPage />} />
              </Route>
              {/* Protected chat route for mothers only */}
              <Route element={<ProtectedRoute />}>
                <Route path="/chat" element={isMother ? <ChatRealtimePage /> : <NotFound />} />
              </Route>
              <Route path="/realtime-chat" element={<ChatRealtimePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
