import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../ui/BackButton';
import { Bell } from 'lucide-react';

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
    // Fetch the assigned doctor for the mother (for demo, fallback to doctor with id 1)
    const fetchReminders = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the first available doctor
        const doctorRes = await fetch(`${API_BASE}/api/doctors`);
        const doctors = await doctorRes.json();
        const doctorId = Array.isArray(doctors) && doctors.length > 0 ? doctors[0].id : 1;
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
      <div className="pt-4 pl-4"><BackButton /></div>
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