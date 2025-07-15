import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import {
  Menu as MenuIcon,
  LogOut,
  Home,
  User,
  Calendar,
  Heart,
  MessageCircle,
  Bot,
  Bell,
  Globe,
  Video,
  MapPin,
  QrCode
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'lg', name: 'Luganda' },
  { code: 'es', name: 'Español' },
  { code: 'ar', name: 'العربية' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिन्दी' },
];

export const Navigation: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('mamacare_language', langCode);
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  const navItems = [
    // Always visible items
    { to: '/', icon: Home, label: t('nav.home') || 'Home', show: true },
    { to: '/videos', icon: Video, label: t('nav.videos') || 'Videos', show: true },
    { to: '/health-tips', icon: Heart, label: t('nav.healthTips') || 'Health Tips', show: true },
    { to: '/qrcode', icon: QrCode, label: t('nav.qrCode') || 'QR Code', show: true },
    { to: '/locationfinder', icon: MapPin, label: t('nav.locationFinder') || 'Location Finder', show: true },
    
    // Authentication required items
    { to: '/profile', icon: User, label: t('nav.profile') || 'Profile', show: isAuthenticated },
    { to: '/appointments', icon: Calendar, label: t('nav.appointments') || 'Appointments', show: isAuthenticated },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat') || 'Live Chat', show: isAuthenticated },
    { to: '/ai-support', icon: Bot, label: t('nav.aiSupport') || 'AI Support', show: isAuthenticated },
    { to: '/notifications', icon: Bell, label: t('nav.notifications') || 'Notifications', show: isAuthenticated },
    
    // Only visible when NOT authenticated
    { to: '/register', icon: User, label: t('nav.register') || 'Register', show: !isAuthenticated },
    { to: '/login', icon: User, label: t('nav.login') || 'Login', show: !isAuthenticated }
  ];

  return (
    <nav className="relative z-50">
      <button
        className="fixed top-4 left-4 bg-pink-500 text-white p-3 rounded-full shadow-lg focus:outline-none hover:bg-pink-600 transition-colors"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>
      {open && (
        <div className="fixed top-16 left-4 bg-white rounded-xl shadow-xl p-4 min-w-[240px] flex flex-col space-y-2 animate-fade-in z-50 border border-gray-100">
          {navItems.filter(item => item.show).map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold transition-colors ${
                    isActive
                      ? 'bg-pink-200 text-pink-800'
                      : 'text-gray-700 hover:bg-pink-100'
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <IconComponent className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          {/* Logout button - only show when authenticated */}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-gray-100 pt-2"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('nav.logout') || 'Logout'}</span>
            </button>
          )}
          
          {/* Language selector */}
          <div className="mt-4 pt-2 border-t border-gray-100">
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t('nav.language') || 'Language'} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
