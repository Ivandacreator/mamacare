import { Patient, Appointment, ChatMessage, Alert, Symptom, ContentItem, Analytics } from '../types/index';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com',
    address: '123 Main St, Springfield, IL',
    pregnancyWeek: 24,
    dueDate: '2024-06-15',
    riskLevel: 'low',
    lastVisit: '2024-01-15',
    nextAppointment: '2024-02-15',
    bloodType: 'O+',
    allergies: ['Penicillin'],
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '+1 (555) 123-4568',
      relationship: 'Husband'
    }
  },
  {
    id: '2',
    name: 'Emily Davis',
    age: 32,
    phone: '+1 (555) 234-5678',
    email: 'emily.davis@email.com',
    address: '456 Oak Ave, Springfield, IL',
    pregnancyWeek: 32,
    dueDate: '2024-04-20',
    riskLevel: 'medium',
    lastVisit: '2024-01-20',
    nextAppointment: '2024-02-10',
    bloodType: 'A+',
    allergies: ['Latex', 'Shellfish'],
    emergencyContact: {
      name: 'John Davis',
      phone: '+1 (555) 234-5679',
      relationship: 'Husband'
    }
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    age: 26,
    phone: '+1 (555) 345-6789',
    email: 'maria.rodriguez@email.com',
    address: '789 Pine St, Springfield, IL',
    pregnancyWeek: 36,
    dueDate: '2024-03-30',
    riskLevel: 'high',
    lastVisit: '2024-01-25',
    nextAppointment: '2024-02-05',
    bloodType: 'B-',
    allergies: [],
    emergencyContact: {
      name: 'Carlos Rodriguez',
      phone: '+1 (555) 345-6790',
      relationship: 'Husband'
    }
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    date: '2024-02-15',
    time: '09:00',
    type: 'checkup',
    status: 'scheduled',
    duration: 30,
    notes: 'Regular prenatal checkup'
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emily Davis',
    date: '2024-02-10',
    time: '14:30',
    type: 'ultrasound',
    status: 'scheduled',
    duration: 45,
    notes: '32-week anatomy scan'
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Maria Rodriguez',
    date: '2024-02-05',
    time: '11:00',
    type: 'consultation',
    status: 'scheduled',
    duration: 60,
    notes: 'High-risk pregnancy consultation'
  }
];

export const mockMessages: ChatMessage[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    message: 'Hi Dr. Smith, I\'ve been experiencing some mild nausea. Is this normal at 24 weeks?',
    timestamp: '2024-01-30T10:30:00Z',
    isRead: false,
    isFromDoctor: false,
    urgent: false
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emily Davis',
    message: 'I felt some strong kicks last night. The baby seems very active!',
    timestamp: '2024-01-30T15:45:00Z',
    isRead: true,
    isFromDoctor: false,
    urgent: false
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Maria Rodriguez',
    message: 'I\'m having severe headaches and my blood pressure feels high. Should I come in?',
    timestamp: '2024-01-30T20:15:00Z',
    isRead: false,
    isFromDoctor: false,
    urgent: true
  }
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    patientId: '3',
    patientName: 'Maria Rodriguez',
    type: 'critical',
    title: 'High Blood Pressure Alert',
    message: 'Patient reported severe headaches and high BP symptoms',
    timestamp: '2024-01-30T20:15:00Z',
    isRead: false,
    action: 'Schedule immediate consultation'
  },
  {
    id: '2',
    patientId: '1',
    patientName: 'Sarah Johnson',
    type: 'reminder',
    title: 'Appointment Reminder',
    message: 'Upcoming appointment on Feb 15, 2024 at 9:00 AM',
    timestamp: '2024-01-30T08:00:00Z',
    isRead: true
  },
  {
    id: '3',
    patientId: '2',
    patientName: 'Emily Davis',
    type: 'info',
    title: 'Lab Results Available',
    message: 'Blood work results from last visit are ready for review',
    timestamp: '2024-01-29T14:30:00Z',
    isRead: false
  }
];

export const mockSymptoms: Symptom[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    symptom: 'Morning Sickness',
    severity: 'mild',
    date: '2024-01-30',
    notes: 'Occurs mostly in the morning, manageable with crackers',
    resolved: false
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Emily Davis',
    symptom: 'Back Pain',
    severity: 'moderate',
    date: '2024-01-28',
    notes: 'Lower back pain, especially when standing for long periods',
    resolved: false
  },
  {
    id: '3',
    patientId: '3',
    patientName: 'Maria Rodriguez',
    symptom: 'Headaches',
    severity: 'severe',
    date: '2024-01-30',
    notes: 'Severe headaches with vision changes, possible preeclampsia',
    resolved: false
  }
];

export const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Prenatal Nutrition Guidelines',
    type: 'article',
    category: 'nutrition',
    content: 'Complete guide to proper nutrition during pregnancy...',
    dateCreated: '2024-01-01',
    lastUpdated: '2024-01-15',
    isPublished: true
  },
  {
    id: '2',
    title: 'Safe Exercise During Pregnancy',
    type: 'video',
    category: 'exercise',
    content: 'Video series showing safe exercises for pregnant women...',
    dateCreated: '2024-01-10',
    lastUpdated: '2024-01-20',
    isPublished: true
  },
  {
    id: '3',
    title: 'Mental Health Support Resources',
    type: 'guide',
    category: 'mental-health',
    content: 'Resources and support for mental health during pregnancy...',
    dateCreated: '2024-01-05',
    lastUpdated: '2024-01-25',
    isPublished: false
  }
];

export const mockAnalytics: Analytics = {
  totalPatients: 145,
  appointmentsToday: 8,
  unreadMessages: 12,
  criticalAlerts: 2,
  averagePregnancyWeek: 28.5,
  riskDistribution: {
    low: 85,
    medium: 45,
    high: 15
  },
  monthlyAppointments: [120, 135, 155, 142, 168, 158, 172, 165, 180, 175, 190, 185],
  patientSatisfaction: 4.7
};