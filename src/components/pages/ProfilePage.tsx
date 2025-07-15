
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Calendar, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import BackButton from '../ui/BackButton';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dueDate: user?.dueDate || '',
    healthStatus: user?.healthStatus || ''
  });
  const [assignedDoctor, setAssignedDoctor] = useState<any>(null);

  useEffect(() => {
    // Fetch assigned doctor info if user is a mother and has doctor_id
    const fetchDoctor = async () => {
      if (user?.role === 'mother' && user?.doctor_id) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/doctors/${user.doctor_id}`);
          if (res.ok) {
            const data = await res.json();
            setAssignedDoctor(data);
          }
        } catch (e) {
          setAssignedDoctor(null);
        }
      }
    };
    fetchDoctor();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dueDate: user?.dueDate || '',
      healthStatus: user?.healthStatus || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('profile.title')}
          </h1>
          <p className="text-gray-600">Manage your health information</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {user?.name || 'Your Profile'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{t('profile.name')}</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">{user?.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{t('profile.email')}</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">{user?.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>{t('profile.phone')}</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">{user?.phone}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{t('profile.dueDate')}</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="border-pink-200 focus:border-pink-400"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md">{user?.dueDate}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthStatus" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>{t('profile.healthStatus')}</span>
              </Label>
              {isEditing ? (
                <Input
                  id="healthStatus"
                  value={formData.healthStatus}
                  onChange={(e) => handleInputChange('healthStatus', e.target.value)}
                  className="border-pink-200 focus:border-pink-400"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">{user?.healthStatus}</div>
              )}
            </div>

            {/* Assigned Doctor Info */}
            {user?.role === 'mother' && user?.doctor_id && assignedDoctor && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-bold text-purple-700 mb-2">Assigned Doctor</h3>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                  <div className="flex-1">
                    <div className="font-semibold">Name: <span className="text-gray-800">{assignedDoctor.name}</span></div>
                    <div className="text-sm text-gray-600">Email: {assignedDoctor.email}</div>
                    <div className="text-sm text-gray-600">Phone: {assignedDoctor.phone}</div>
                    {assignedDoctor.specialty && <div className="text-sm text-gray-600">Specialty: {assignedDoctor.specialty}</div>}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4 pt-6">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                  >
                    {t('profile.save')}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-pink-200 text-pink-700 hover:bg-pink-50"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  {t('profile.edit')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
