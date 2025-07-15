import './index.css';

export interface Patient {
    id: string;
    name: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    pregnancyWeek?: number;
    dueDate?: string;
    riskLevel: 'low' | 'medium' | 'high';
    lastVisit: string;
    nextAppointment?: string;
    bloodType: string;
    allergies: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
    };
  }
  
  export interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    time: string;
    type: 'checkup' | 'ultrasound' | 'consultation' | 'emergency';
    status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
    notes?: string;
    duration: number;
  }
  
  export interface ChatMessage {
    id: string;
    patientId: string;
    patientName: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    isFromDoctor: boolean;
    urgent: boolean;
  }
  
  export interface Alert {
    id: string;
    patientId: string;
    patientName: string;
    type: 'critical' | 'warning' | 'info' | 'reminder';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    action?: string;
  }
  
  export interface Symptom {
    id: string;
    patientId: string;
    patientName: string;
    symptom: string;
    severity: 'mild' | 'moderate' | 'severe';
    date: string;
    notes?: string;
    resolved: boolean;
  }
  
  export interface ContentItem {
    id: string;
    title: string;
    type: 'article' | 'video' | 'guide' | 'form';
    category: 'prenatal' | 'nutrition' | 'exercise' | 'mental-health' | 'postpartum';
    content: string;
    dateCreated: string;
    lastUpdated: string;
    isPublished: boolean;
  }
  
  export interface Analytics {
    totalPatients: number;
    appointmentsToday: number;
    unreadMessages: number;
    criticalAlerts: number;
    averagePregnancyWeek: number;
    riskDistribution: {
      low: number;
      medium: number;
      high: number;
    };
    monthlyAppointments: number[];
    patientSatisfaction: number;
  }