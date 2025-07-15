
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  type: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty?: string;
}

export const AppointmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      date: '2024-12-20',
      time: '10:00',
      doctor: 'Dr. Maria Santos',
      type: 'Regular Checkup'
    },
    {
      id: '2',
      date: '2024-12-27',
      time: '14:30',
      doctor: 'Dr. James Wilson',
      type: 'Ultrasound'
    },
    {
      id: '3',
      date: '2025-01-03',
      time: '09:00',
      doctor: 'Dr. Sarah Johnson',
      type: 'Blood Test'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    doctor: '',
    type: ''
  });

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [errorDoctors, setErrorDoctors] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      setErrorDoctors(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/doctors`);
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
    fetchDoctors();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setNewAppointment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBookAppointment = () => {
    if (newAppointment.date && newAppointment.time && newAppointment.doctor && newAppointment.type) {
      const appointment: Appointment = {
        id: Date.now().toString(),
        ...newAppointment
      };
      
      setAppointments(prev => [...prev, appointment]);
      setNewAppointment({ date: '', time: '', doctor: '', type: '' });
      
      toast({
        title: "Appointment Booked",
        description: `Your appointment with ${newAppointment.doctor} has been scheduled.`,
      });
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all appointment details.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white/90 rounded-xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('appointments.title')}
          </h1>
          <p className="text-gray-600">Schedule and manage your healthcare appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Calendar className="h-5 w-5 text-pink-600" />
                  <span>{t('appointments.upcoming')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-100">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{appointment.date}</span>
                              <Clock className="h-4 w-4 ml-2" />
                              <span>{appointment.time}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <User className="h-4 w-4 text-gray-600" />
                              <span className="font-medium">{appointment.doctor}</span>
                            </div>
                            <div className="text-sm text-purple-600 font-medium">
                              {appointment.type}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">{t('appointments.noAppointments')}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Book New Appointment */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Plus className="h-5 w-5 text-pink-600" />
                  <span>{t('appointments.book')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">{t('appointments.date')}</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="border-pink-200 focus:border-pink-400"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">{t('appointments.time')}</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">{t('appointments.doctor')}</Label>
                  {loadingDoctors ? (
                    <div className="text-sm text-gray-500">Loading doctors...</div>
                  ) : errorDoctors ? (
                    <div className="text-sm text-red-500">{errorDoctors}</div>
                  ) : (
                    <Select onValueChange={(value) => handleInputChange('doctor', value)}>
                      <SelectTrigger className="border-pink-200 focus:border-pink-400">
                        <SelectValue placeholder="Select a healthcare provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map(doc => (
                          <SelectItem key={doc.id} value={doc.name}>
                            {doc.name}{doc.specialty ? ` - ${doc.specialty}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">{t('appointments.type')}</Label>
                  <Select onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger className="border-pink-200 focus:border-pink-400">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular Checkup">Regular Checkup</SelectItem>
                      <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                      <SelectItem value="Blood Test">Blood Test</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleBookAppointment}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  {t('appointments.bookButton')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
