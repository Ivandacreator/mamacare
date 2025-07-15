
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BackButton from '../ui/BackButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Apple, Dumbbell, Brain, BookOpen, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface Reminder {
  id: number;
  title: string;
  message: string;
  date: string;
  time: string;
  is_active: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const RemindersPage: React.FC = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    // For demo: assume mother is assigned to the first doctor (or add doctor_id to user profile)
    // You may want to fetch the assigned doctor_id for the mother from your backend
    const fetchReminders = async () => {
      setLoading(true);
      setError(null);
      try {
        // For now, fetch all reminders for all doctors (or use a real doctor_id)
        // You may want to update this to fetch reminders for the mother's assigned doctor
        const doctorId = user.doctor_id || 1; // Replace with real logic if needed
        const res = await fetch(`${API_BASE}/api/doctors/reminders/${doctorId}`);
        const data = await res.json();
        setReminders(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to fetch reminders.');
      }
      setLoading(false);
    };
    fetchReminders();
  }, [user]);

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Bell size={28} className="text-pink-600" />
        <h1 className="text-2xl font-bold text-gray-800">Reminders from Your Doctor</h1>
      </div>
      {loading ? (
        <div className="text-center text-gray-500">Loading reminders...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : reminders.length === 0 ? (
        <div className="text-center text-gray-500">No reminders found.</div>
      ) : (
        <ul className="space-y-4">
          {reminders.map(reminder => (
            <li key={reminder.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg text-pink-700">{reminder.title}</span>
                <span className="text-xs text-gray-500">{reminder.date} {reminder.time}</span>
              </div>
              <div className="text-gray-700 mb-1">{reminder.message}</div>
              {reminder.is_active ? (
                <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Active</span>
              ) : (
                <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">Inactive</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RemindersPage;

export const HealthTipsPage: React.FC = () => {
  const { t } = useTranslation();
  
  const healthTips: HealthTip[] = [
    // Pregnancy Tips
    {
      id: '1',
      title: 'Stay Hydrated',
      content: 'Drink at least 8-10 glasses of water daily. Proper hydration is crucial for both you and your baby\'s health during pregnancy.',
      category: 'pregnancy'
    },
    {
      id: '2',
      title: 'Get Regular Prenatal Care',
      content: 'Regular checkups with your healthcare provider help monitor your baby\'s development and catch any potential issues early.',
      category: 'pregnancy'
    },
    {
      id: '3',
      title: 'Take Prenatal Vitamins',
      content: 'Folic acid, iron, and other essential nutrients support your baby\'s development. Always consult your doctor about the right supplements.',
      category: 'pregnancy'
    },
    
    // Nutrition Tips
    {
      id: '4',
      title: 'Eat Folate-Rich Foods',
      content: 'Include leafy greens, citrus fruits, and fortified cereals in your diet. Folate helps prevent birth defects.',
      category: 'nutrition'
    },
    {
      id: '5',
      title: 'Choose Lean Proteins',
      content: 'Fish, poultry, beans, and nuts provide essential proteins for your baby\'s growth. Avoid high-mercury fish.',
      category: 'nutrition'
    },
    {
      id: '6',
      title: 'Limit Caffeine',
      content: 'Keep caffeine intake under 200mg per day (about one 12-oz cup of coffee). Too much caffeine can affect your baby.',
      category: 'nutrition'
    },
    
    // Exercise Tips
    {
      id: '7',
      title: 'Walking is Great',
      content: 'A 30-minute walk daily helps maintain fitness, improves mood, and can ease pregnancy discomforts.',
      category: 'exercise'
    },
    {
      id: '8',
      title: 'Try Prenatal Yoga',
      content: 'Gentle yoga can improve flexibility, reduce stress, and help prepare your body for childbirth.',
      category: 'exercise'
    },
    {
      id: '9',
      title: 'Swimming is Safe',
      content: 'Swimming is an excellent low-impact exercise that\'s easy on your joints and provides a full-body workout.',
      category: 'exercise'
    },
    
    // Mental Health Tips
    {
      id: '10',
      title: 'Practice Relaxation',
      content: 'Deep breathing, meditation, or gentle music can help reduce stress and anxiety during pregnancy.',
      category: 'mental'
    },
    {
      id: '11',
      title: 'Get Enough Sleep',
      content: 'Aim for 7-9 hours of sleep nightly. Use pillows to support your growing belly and find comfortable positions.',
      category: 'mental'
    },
    {
      id: '12',
      title: 'Build Support Network',
      content: 'Connect with other expectant mothers, join support groups, and maintain relationships with family and friends.',
      category: 'mental'
    }
  ];

  const categories = [
    { id: 'pregnancy', icon: Heart, label: t('tips.pregnancy'), color: 'from-pink-400 to-pink-600' },
    { id: 'nutrition', icon: Apple, label: t('tips.nutrition'), color: 'from-green-400 to-green-600' },
    { id: 'exercise', icon: Dumbbell, label: t('tips.exercise'), color: 'from-blue-400 to-blue-600' },
    { id: 'mental', icon: Brain, label: t('tips.mental'), color: 'from-purple-400 to-purple-600' }
  ];

  const getTipsByCategory = (category: string) => {
    return healthTips.filter(tip => tip.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('tips.title')}
          </h1>
          <p className="text-gray-600">Expert advice for a healthy pregnancy journey</p>
        </div>

        <Tabs defaultValue="pregnancy" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-100 data-[state=active]:to-purple-100 data-[state=active]:text-pink-700"
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => {
            const IconComponent = category.icon;
            const categoryTips = getTipsByCategory(category.id);
            
            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTips.map((tip) => (
                    <Card key={tip.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardHeader>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-3`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {tip.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">
                          {tip.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Additional Resources */}
        <Card className="mt-12 bg-gradient-to-r from-pink-100 to-purple-100 border-0">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Need More Information?
            </h3>
            <p className="text-gray-600 mb-4">
              Always consult with your healthcare provider before making any significant changes to your diet, exercise routine, or lifestyle during pregnancy.
            </p>
            <p className="text-sm text-pink-700 font-medium">
              Remember: Every pregnancy is unique. What works for others may not be right for you.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
