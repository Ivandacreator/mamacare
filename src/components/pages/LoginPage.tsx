
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';
import { QrCode as QrCodeIcon } from 'lucide-react';
import BackButton from '../ui/BackButton';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mother'); // default role
  const [isLoading, setIsLoading] = useState(false);

  // QR code logic
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const appUrl = (import.meta.env.VITE_APP_URL || 'http://localhost:8080') + '/login';
  useEffect(() => {
    QRCodeLib.toDataURL(appUrl, {
      width: 180,
      margin: 2,
      color: { dark: '#E91E63', light: '#FFFFFF' }
    }).then(setQrCodeUrl);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password, role);
      if (success) {
        // Check user role and navigate accordingly
        const storedUser = JSON.parse(localStorage.getItem('mamacare_user') || '{}');
        if (storedUser && storedUser.role === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/home');
        }
        toast({
          title: "Login Successful",
          description: "Welcome back to MamaCare!",
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials, user not found, or wrong role selected. Please check your details and try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4"><BackButton to="/" /></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-900">{t('app.title')}</h1>
          <p className="text-gray-600 mt-2">{t('app.description')}</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('auth.welcome')}
            </CardTitle>
            <CardDescription>
              {t('auth.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mama@example.com"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="border-pink-200 focus:border-pink-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Login as</Label>
                <select
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="mother">Mother</option>
                  <option value="doctor">Doctor</option>
                </select>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? '...' : t('auth.loginButton')}
              </Button>
            </form>
            
            <div className="mt-4 text-center text-sm text-gray-600">
              <p className="mt-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-pink-600 hover:underline">Create one</Link>
              </p>
            </div>
          </CardContent>
        </Card>
        {/* QR Code Section */}
        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-2">
            <QrCodeIcon size={24} className="text-pink-600" />
            <span className="font-semibold text-gray-700">Scan to access MamaCare App</span>
          </div>
          {qrCodeUrl && (
            <img
              src={qrCodeUrl}
              alt="MamaCare App QR Code"
              className="rounded-lg shadow-md border border-gray-200"
              style={{ width: 180, height: 180 }}
            />
          )}
          <span className="text-xs text-gray-500 mt-2">Scan with your phone to open the app</span>
        </div>
      </div>
    </div>
  );
};
