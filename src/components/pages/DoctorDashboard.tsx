import React, { useEffect, useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, PhoneCall, Users, ClipboardList, Bell, PlusCircle, Send, MessageCircle, Badge } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { io, Socket } from 'socket.io-client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MapPin, BarChart2, FileText, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';

interface Appointment {
  id: number;
  mother_name: string;
  date: string;
  time: string;
  status: string;
  phone: string;
  reason: string;
}

interface Patient {
  id: number;
  name: string;
  email: string;
  phone?: string;
  due_date?: string;
  health_status?: string;
  unreadMessages?: number; // Added for unread messages simulation
}

interface Reminder {
  id: number;
  title: string;
  message: string;
  date: string;
  time: string;
  is_active: boolean;
}

const DoctorDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [reminderForm, setReminderForm] = useState({ title: '', message: '', date: '', time: '' });
  const [reminderLoading, setReminderLoading] = useState(false);
  const [selectedMother, setSelectedMother] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<{ [motherId: string]: number }>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('patients');
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) return;
    fetchAppointments();
    fetchPatients();
    fetchReminders();
  }, [user]);

  // Fetch messages when a mother is selected
  useEffect(() => {
    if (selectedMother && user) {
      fetchMessages(selectedMother.id);
    }
  }, [selectedMother, user]);

  // Fetch unread message counts
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!user?.id) return;
      try {
        const res = await fetch(`${API_BASE}/messages/unread-count/${user.id}`);
        const data = await res.json();
        const counts: { [motherId: string]: number } = {};
        data.forEach((row: any) => {
          counts[row.mother_id] = row.unread;
        });
        setUnreadCounts(counts);
      } catch (e) {
        setUnreadCounts({});
      }
    };
    fetchUnreadCounts();
    // Optionally, poll every 10 seconds
    const interval = setInterval(fetchUnreadCounts, 10000);
    return () => clearInterval(interval);
  }, [user]);

  // Real-time notification for new messages (Socket.IO integration recommended for production)
  useEffect(() => {
    // This is a placeholder for real-time notifications
    // In production, use Socket.IO to listen for new messages and show toast
    // toast({ title: 'New Message', description: 'You have a new message from a mother.' });
  }, []);

  // --- Socket.IO Real-time Chat Setup ---
  useEffect(() => {
    if (!user) return;
    const s = io(SOCKET_URL);
    setSocket(s);
    return () => { s.disconnect(); };
  }, [user]);

  useEffect(() => {
    if (!socket || !selectedMother || !user) return;
    const roomId = `room_${[user.id, selectedMother.id].sort().join('_')}`;
    socket.emit('joinRoom', { roomId, user: user.name });
    socket.on('chatHistory', (history: any[]) => {
      setMessages(
        history.map((msg) => ({
          user: msg.mother_name ? msg.mother_name : msg.sender,
          text: msg.message,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mother_name: msg.mother_name,
          sender: msg.sender
        }))
      );
    });
    socket.on('receiveMessage', (message: any) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socket.off('chatHistory');
      socket.off('receiveMessage');
    };
  }, [socket, selectedMother, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/doctors/appointments/${user.id}`);
      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      setAppointments([]);
    }
    setLoading(false);
  };

  const fetchPatients = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/doctors/patients/${user.id}`);
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (e) {
      setPatients([]);
    }
  };

  const fetchReminders = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE}/api/doctors/reminders/${user.id}`);
      const data = await res.json();
      setReminders(Array.isArray(data) ? data : []);
    } catch (e) {
      setReminders([]);
    }
  };

  const fetchMessages = async (motherId: number) => {
    setChatLoading(true);
    try {
      const res = await fetch(`${API_BASE}/messages?doctor_id=${user?.id}&mother_id=${motherId}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      // Mark messages as read
      await fetch(`${API_BASE}/messages/read`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ doctor_id: user.id, mother_id: motherId, reader: 'doctor' }) });
    } catch (e) {
      setMessages([]);
    }
    setChatLoading(false);
  };

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`${API_BASE}/api/doctors/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setReminderLoading(true);
    await fetch(`${API_BASE}/api/doctors/reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_id: user?.id,
        ...reminderForm,
      }),
    });
    setReminderForm({ title: '', message: '', date: '', time: '' });
    setReminderLoading(false);
    fetchReminders();
  };

  const handleDeleteReminder = async (id: number) => {
    await fetch(`${API_BASE}/api/doctors/reminders/${id}`, { method: 'DELETE' });
    fetchReminders();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMother || !user || !socket) return;
    const roomId = `room_${[user.id, selectedMother.id].sort().join('_')}`;
    const messageObj = {
      user: user.name,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mother_name: selectedMother.name,
      sender: 'doctor',
    };
    // Emit real-time message
    socket.emit('sendMessage', {
      roomId,
      message: messageObj,
      senderId: user.id,
      senderRole: 'doctor',
      doctor_id: user.id,
      mother_id: selectedMother.id
    });
    // Persist to DB
    await fetch(`${API_BASE}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_id: user.id,
        mother_id: selectedMother.id,
        sender: 'doctor',
        message: newMessage,
      }),
    });
    setNewMessage('');
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifMessage.trim() || !selectedMother) return;
    setNotifLoading(true);
    await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctor_id: user?.id,
        mother_id: selectedMother.id,
        message: notifMessage,
      }),
    });
    setNotifMessage('');
    setNotifLoading(false);
    alert('Notification sent!');
  };

  // Quick stats
  const stats = [
    { label: 'Appointments', value: appointments.length, icon: <Calendar className="text-blue-600" /> },
    { label: 'Patients', value: patients.length, icon: <Users className="text-green-600" /> },
    { label: 'Reminders', value: reminders.length, icon: <Bell className="text-yellow-600" /> },
  ];

  // Calculate total unread messages
  const unreadMessagesCount = Object.values(unreadCounts).reduce((acc, n) => acc + n, 0);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="flex justify-between items-center px-8">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Logout
        </button>
        <div className="flex items-center space-x-4">
          {/* Notification Bell (future use) */}
          <button className="relative p-2 rounded-full hover:bg-pink-100 transition-colors">
            <Bell className="h-6 w-6 text-pink-600" />
            {/* Future: show badge if there are notifications */}
          </button>
          {/* Doctor Chat Room Button with unread badge - removed as requested */}
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-8 text-white flex items-center space-x-3">
          <Calendar size={32} />
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-9 gap-1 bg-white/80 backdrop-blur-sm rounded-xl shadow p-2 mb-6">
              <TabsTrigger value="patients"><Users className="inline mr-1" />Patients</TabsTrigger>
              <TabsTrigger value="appointments"><Calendar className="inline mr-1" />Appointments</TabsTrigger>
              <TabsTrigger value="chat"><MessageCircle className="inline mr-1" />Chat</TabsTrigger>
              <TabsTrigger value="alerts"><AlertTriangle className="inline mr-1" />Alerts</TabsTrigger>
              <TabsTrigger value="content"><FileText className="inline mr-1" />Content</TabsTrigger>
              <TabsTrigger value="symptoms"><ClipboardList className="inline mr-1" />Symptoms</TabsTrigger>
              <TabsTrigger value="analytics"><BarChart2 className="inline mr-1" />Analytics</TabsTrigger>
              <TabsTrigger value="map"><MapPin className="inline mr-1" />Map</TabsTrigger>
              <TabsTrigger value="settings"><SettingsIcon className="inline mr-1" />Settings</TabsTrigger>
            </TabsList>
            {/* Patients Tab */}
            <TabsContent value="patients">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Users className="mr-2 text-green-600" /> Patients</h2>
                {/* Search Bar */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-64 focus:ring-2 focus:ring-pink-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                {/* Patients Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unread</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center text-gray-500 py-6">No patients found.</td>
                        </tr>
                      ) : (
                        filteredPatients.map((patient) => (
                          <tr key={patient.id} className="hover:bg-pink-50 transition">
                            <td className="px-4 py-2 font-semibold text-pink-700">{patient.name}</td>
                            <td className="px-4 py-2 text-gray-700">{patient.email}</td>
                            <td className="px-4 py-2 text-gray-700">{patient.phone || '-'}</td>
                            <td className="px-4 py-2 text-gray-700">{patient.due_date || '-'}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${patient.health_status === 'Good' ? 'bg-green-100 text-green-700' : patient.health_status === 'At Risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{patient.health_status || 'Unknown'}</span>
                            </td>
                            <td className="px-4 py-2 text-center">
                              {unreadCounts[patient.id] > 0 ? (
                                <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">{unreadCounts[patient.id]}</span>
                              ) : (
                                <span className="text-gray-400 text-xs">0</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-center flex gap-2 justify-center">
                              <button
                                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                                onClick={() => setSelectedMother(patient)}
                              >
                                Message
                              </button>
                              <button
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-semibold shadow"
                                disabled
                              >
                                View Profile
                              </button>
                              <button
                                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-xs font-semibold shadow"
                                disabled
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            {/* Appointments Tab */}
            <TabsContent value="appointments">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Calendar className="mr-2 text-blue-600" /> Appointments</h2>
                {loading ? (
                  <p className="text-gray-500">Loading appointments...</p>
                ) : !Array.isArray(appointments) || appointments.length === 0 ? (
                  <p className="text-gray-500">No appointments yet.</p>
                ) : (
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {appointments.map((appt) => (
                          <tr key={appt.id} className="hover:bg-blue-50 transition">
                            <td className="px-4 py-2 font-semibold text-blue-700">{appt.mother_name}</td>
                            <td className="px-4 py-2 text-gray-700">{appt.date}</td>
                            <td className="px-4 py-2 text-gray-700">{appt.time}</td>
                            <td className="px-4 py-2 text-gray-700">{appt.reason}</td>
                            <td className="px-4 py-2 text-gray-700">{appt.phone}</td>
                            <td className="px-4 py-2 text-center">
                              {appt.status === 'pending' && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pending</span>
                              )}
                              {appt.status === 'confirmed' && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Confirmed</span>
                              )}
                              {appt.status === 'cancelled' && (
                                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Cancelled</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-center flex gap-2 justify-center">
                              <button
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                                onClick={() => handleStatusChange(appt.id, 'confirmed')}
                                disabled={appt.status === 'confirmed'}
                              >
                                Mark Complete
                              </button>
                              <button
                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs font-semibold shadow"
                                onClick={() => handleStatusChange(appt.id, 'pending')}
                                disabled={appt.status === 'pending'}
                              >
                                Reschedule
                              </button>
                              <button
                                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-xs font-semibold shadow"
                                onClick={() => handleStatusChange(appt.id, 'cancelled')}
                                disabled={appt.status === 'cancelled'}
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {/* Calendar View Placeholder */}
                <div className="mt-8">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-6 text-center text-gray-600">
                    <span className="font-semibold">[Calendar View Coming Soon]</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            {/* Chat Tab */}
            <TabsContent value="chat">
              {selectedMother ? (
                <>
                  <div className="flex items-center mb-2">
                    <MessageCircle className="mr-2 text-pink-600" />
                    <h3 className="text-lg font-bold text-gray-800">Chat with {selectedMother.name}</h3>
                  </div>
                  <div className="overflow-y-auto border rounded p-2 bg-gray-50 h-96 max-h-96 min-h-[16rem]">
                    {chatLoading ? (
                      <p className="text-gray-500">Loading messages...</p>
                    ) : messages.length === 0 ? (
                      <p className="text-gray-500">No messages yet.</p>
                    ) : (
                      messages.map((msg, idx) => {
                        const isDoctor = msg.sender === 'doctor' || msg.user === (user?.name || 'Doctor');
                        const senderLabel = isDoctor ? (user?.name || 'Doctor') : (selectedMother?.name || 'Mother');
                        return (
                          <div key={idx} className={`mb-4 flex ${isDoctor ? 'justify-end' : 'justify-start'}`}> 
                            <div className={`w-full max-w-full px-4 py-2 rounded-2xl shadow-md relative ${isDoctor ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-none'}`}
                              style={{ minWidth: '120px' }}>
                              <div className={`text-xs font-bold mb-1 ${isDoctor ? 'text-pink-100' : 'text-pink-600'}`}>{isDoctor ? 'Doctor' : senderLabel}</div>
                              <div className="break-words whitespace-pre-line w-full max-w-full">{msg.message || msg.text}</div>
                              <div className="text-[10px] text-right mt-1 text-gray-400">{msg.time}</div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center"
                      disabled={chatLoading}
                    >
                      <Send className="w-4 h-4 mr-1" /> Send
                    </button>
                  </form>
                  {/* Notification Form */}
                  <form onSubmit={handleSendNotification} className="flex gap-2 mt-4">
                    <input
                      type="text"
                      value={notifMessage}
                      onChange={e => setNotifMessage(e.target.value)}
                      placeholder="Send notification to this mother..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg flex items-center"
                      disabled={notifLoading}
                    >
                      <Bell className="w-4 h-4 mr-1" /> Send Notification
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-gray-500 text-center py-8">Select a patient from the Patients tab to start chatting.</div>
              )}
            </TabsContent>
            {/* Alerts Tab */}
            <TabsContent value="alerts">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><AlertTriangle className="mr-2 text-yellow-600" /> Alerts</h2>
                <p className="text-gray-500">No alerts at this time. (You can integrate real alerts here.)</p>
              </div>
            </TabsContent>
            {/* Content Tab */}
            <TabsContent value="content">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><FileText className="mr-2 text-purple-600" /> Educational Content</h2>
                <ul className="list-disc pl-6 text-gray-700">
                  <li>Maternal health guidelines</li>
                  <li>Best practices for prenatal care</li>
                  <li>Nutrition and exercise resources</li>
                  <li>Patient education handouts</li>
                </ul>
              </div>
            </TabsContent>
            {/* Symptoms Tab */}
            <TabsContent value="symptoms">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><ClipboardList className="mr-2 text-pink-600" /> Symptoms</h2>
                <p className="text-gray-500">Symptom tracking and analytics coming soon.</p>
              </div>
            </TabsContent>
            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><BarChart2 className="inline mr-1" /> Analytics</h2>
                <p className="text-gray-500">Analytics dashboard coming soon. (You can add charts and stats here.)</p>
              </div>
            </TabsContent>
            {/* Map Tab */}
            <TabsContent value="map">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><MapPin className="mr-2 text-green-600" /> Map</h2>
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">Map integration coming soon.</div>
              </div>
            </TabsContent>
            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center"><SettingsIcon className="mr-2 text-gray-600" /> Settings</h2>
                <p className="text-gray-500">Doctor profile and settings coming soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
              <div className="bg-gray-100 rounded-full p-3">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><ClipboardList className="mr-2 text-blue-600" /> Appointments</h2>
          {loading ? (
            <p className="text-gray-500">Loading appointments...</p>
          ) : !Array.isArray(appointments) || appointments.length === 0 ? (
            <p className="text-gray-500">No appointments yet.</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * appt.id }}
                  className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50"
                >
                  <div>
                    <div className="font-semibold text-lg text-blue-700">{appt.mother_name}</div>
                    <div className="text-sm text-gray-600">{appt.date} at {appt.time}</div>
                    <div className="text-sm text-gray-600">Reason: {appt.reason}</div>
                    <div className="text-sm text-gray-600 flex items-center"><PhoneCall size={14} className="mr-1" /> {appt.phone}</div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4 md:mt-0">
                    {appt.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(appt.id, 'accepted')}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle size={16} className="mr-1" /> Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(appt.id, 'rejected')}
                          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={16} className="mr-1" /> Reject
                        </button>
                      </>
                    )}
                    {appt.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusChange(appt.id, 'completed')}
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <CheckCircle size={16} className="mr-1" /> Mark as Completed
                      </button>
                    )}
                    {appt.status === 'completed' && (
                      <span className="text-green-600 font-semibold">Completed</span>
                    )}
                    {appt.status === 'rejected' && (
                      <span className="text-red-600 font-semibold">Rejected</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Patients Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Users className="mr-2 text-green-600" /> Patients</h2>
          {!Array.isArray(patients) || patients.length === 0 ? (
            <p className="text-gray-500">No patients assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="font-semibold text-lg text-green-700">{patient.name}</div>
                  <div className="text-sm text-gray-600">Email: {patient.email}</div>
                  {patient.phone && <div className="text-sm text-gray-600">Phone: {patient.phone}</div>}
                  {patient.due_date && <div className="text-sm text-gray-600">Due Date: {patient.due_date}</div>}
                  {patient.health_status && <div className="text-sm text-gray-600">Health: {patient.health_status}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reminders Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><Bell className="mr-2 text-yellow-600" /> Reminders</h2>
          <form onSubmit={handleAddReminder} className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Title"
              value={reminderForm.title}
              onChange={e => setReminderForm({ ...reminderForm, title: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Message"
              value={reminderForm.message}
              onChange={e => setReminderForm({ ...reminderForm, message: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <input
              type="date"
              value={reminderForm.date}
              onChange={e => setReminderForm({ ...reminderForm, date: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <input
              type="time"
              value={reminderForm.time}
              onChange={e => setReminderForm({ ...reminderForm, time: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              disabled={reminderLoading}
            >
              <PlusCircle size={16} className="mr-1" /> {reminderLoading ? 'Adding...' : 'Add Reminder'}
            </button>
          </form>
          {!Array.isArray(reminders) || reminders.length === 0 ? (
            <p className="text-gray-500">No reminders yet.</p>
          ) : (
            <div className="space-y-3">
              {reminders.map((rem) => (
                <div key={rem.id} className="border rounded-lg p-4 flex items-center justify-between bg-gray-50">
                  <div>
                    <div className="font-semibold text-lg text-yellow-700">{rem.title}</div>
                    <div className="text-sm text-gray-600">{rem.message}</div>
                    <div className="text-xs text-gray-500">{rem.date} at {rem.time}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
      {/* NOTE: To ensure mothers are assigned to a doctor on registration or login, update the backend registration/login logic to assign a doctor_id if not already set. */}
      <Outlet />
    </div>
  );
};

export default DoctorDashboard;