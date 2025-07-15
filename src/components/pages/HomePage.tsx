
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  Calendar, 
  Heart, 
  MessageCircle, 
  Bot, 
  Bell 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from '../Navigation';
import BackButton from '../ui/BackButton';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { io, Socket } from 'socket.io-client';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctors, setDoctors] = useState<{id: number, name: string, phone?: string, specialty?: string}[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [onlineDoctors, setOnlineDoctors] = useState<number[]>([]);
  const socketRef = useRef<Socket | null>(null);

  // Dynamic background for Home page
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
  }, []);

  // Extract unique specialties from doctors
  const specialties = ['all', ...Array.from(new Set(doctors.map(doc => doc.specialty).filter(Boolean)))];

  // Fetch online doctors and listen for status updates
  useEffect(() => {
    // Fetch initial online doctors
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/online-doctors`)
      .then(res => res.json())
      .then(data => setOnlineDoctors(data));
    // Listen for real-time status
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = socket;
    socket.on('doctorStatus', ({ doctorId, status }) => {
      setOnlineDoctors(prev => {
        if (status === 'online') return Array.from(new Set([...prev, Number(doctorId)]));
        else return prev.filter(id => id !== Number(doctorId));
      });
    });
    return () => { socket.disconnect(); };
  }, []);

  const features = [
    {
      title: t('nav.profile'),
      description: t('home.profileCard'),
      icon: User,
      link: '/profile',
      color: 'from-pink-400 to-pink-600'
    },
    {
      title: t('nav.appointments'),
      description: t('home.appointmentsCard'),
      icon: Calendar,
      link: '/appointments',
      color: 'from-purple-400 to-purple-600'
    },
    {
      title: t('nav.healthTips'),
      description: t('home.tipsCard'),
      icon: Heart,
      link: '/health-tips',
      color: 'from-rose-400 to-rose-600'
    },
    {
      title: t('nav.chat'),
      description: t('home.chatCard'),
      icon: MessageCircle,
      link: '/chat',
      color: 'from-pink-500 to-purple-500'
    },
    {
      title: t('nav.aiSupport'),
      description: t('home.aiCard'),
      icon: Bot,
      link: '/ai-support',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      title: t('nav.notifications'),
      description: t('home.notificationsCard'),
      icon: Bell,
      link: '/notifications',
      color: 'from-violet-400 to-violet-600'
    }
  ];

  const handleStartChat = async () => {
    setShowDoctorModal(true);
    setLoadingDoctors(true);
    setErrorDoctors(null);
    try {
      const token = localStorage.getItem('mamacare_token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/doctors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setDoctors(data);
      } else {
        setErrorDoctors('No doctors found.');
      }
    } catch (err) {
      setErrorDoctors('Failed to fetch doctors.');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSelectDoctor = (doctorId: number) => {
    setShowDoctorModal(false);
    navigate(`/chat?doctor_id=${doctorId}&mother_id=${user.id}`);
  };

  // Filter doctors by selected specialty
  const filteredDoctors = selectedSpecialty === 'all'
    ? doctors
    : doctors.filter(doc => doc.specialty === selectedSpecialty);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Dynamic background slideshow */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        {bgImages.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${bgIndex === idx ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        {/* Strong white overlay for readability */}
        <div className="absolute inset-0 bg-white/95" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-transparent rounded-xl shadow-md">
        <Navigation/>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('app.welcome')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('app.description')}
          </p>
          {/* Start Chat Button for Mothers */}
          {user && user.role === 'mother' && (
            <Button
              onClick={handleStartChat}
              className="mt-6 px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold shadow hover:bg-pink-700 transition-colors"
            >
              Start Chat
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('home.features')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link key={index} to={feature.link} className="group">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105 border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 text-center">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="bg-gradient-to-r from-pink-100 to-pink-200 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-pink-700 mb-2">28</div>
              <div className="text-pink-600">Weeks Pregnant</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-100 to-purple-200 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-700 mb-2">3</div>
              <div className="text-purple-600">Upcoming Appointments</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-rose-100 to-rose-200 border-0">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-rose-700 mb-2">12</div>
              <div className="text-rose-600">Health Tips Read</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Doctor Selection Modal */}
      <Dialog open={showDoctorModal} onOpenChange={setShowDoctorModal}>
        <DialogContent>
          <DialogTitle>Select a Doctor to Chat</DialogTitle>
          {loadingDoctors ? (
            <div className="py-4 text-center">Loading doctors...</div>
          ) : errorDoctors ? (
            <div className="py-4 text-red-600">{errorDoctors}</div>
          ) : (
            <div className="py-2">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Filter by Specialty:</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={selectedSpecialty}
                  onChange={e => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec === 'all' ? 'All Specialties' : spec}</option>
                  ))}
                </select>
              </div>
              {filteredDoctors.length === 0 ? (
                <div className="text-gray-500">No doctors available for this specialty.</div>
              ) : (
                <ul className="space-y-2">
                  {filteredDoctors.map(doc => (
                    <li key={doc.id}>
                      <Button
                        variant="outline"
                        className="w-full flex flex-col items-start text-left"
                        onClick={() => handleSelectDoctor(doc.id)}
                      >
                        <span className="font-semibold flex items-center gap-2">
                          {doc.name}
                          <span className={`inline-block w-2 h-2 rounded-full ${onlineDoctors.includes(doc.id) ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span className="text-xs">{onlineDoctors.includes(doc.id) ? 'Online' : 'Offline'}</span>
                        </span>
                        {doc.specialty && <span className="text-xs text-gray-500">{doc.specialty}</span>}
                        {doc.phone && <span className="text-xs text-gray-500">{doc.phone}</span>}
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <div className="mt-4 text-center">
            <Button variant="ghost" onClick={() => setShowDoctorModal(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
