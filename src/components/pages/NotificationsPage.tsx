
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, Heart, MessageCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'health' | 'reminder' | 'chat' | 'emergency';
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Upcoming Appointment',
      message: 'You have an appointment with Dr. Maria Santos tomorrow at 10:00 AM',
      type: 'appointment',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Daily Health Tip',
      message: 'Remember to take your prenatal vitamins with breakfast for better absorption',
      type: 'health',
      timestamp: new Date(Date.now() - 7200000),
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Midwife Response',
      message: 'Sarah has responded to your question about morning sickness',
      type: 'chat',
      timestamp: new Date(Date.now() - 10800000),
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Hydration Reminder',
      message: 'Don\'t forget to drink water! You\'ve only had 3 glasses today',
      type: 'reminder',
      timestamp: new Date(Date.now() - 14400000),
      isRead: false,
      priority: 'low'
    },
    {
      id: '5',
      title: 'Week 28 Milestone',
      message: 'Congratulations! You\'ve reached week 28 of your pregnancy journey',
      type: 'health',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true,
      priority: 'high'
    },
    {
      id: '6',
      title: 'Exercise Reminder',
      message: 'Time for your daily 30-minute walk. The weather is perfect today!',
      type: 'reminder',
      timestamp: new Date(Date.now() - 172800000),
      isRead: true,
      priority: 'low'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'health':
        return Heart;
      case 'chat':
        return MessageCircle;
      case 'reminder':
        return Clock;
      case 'emergency':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') {
      return 'from-red-400 to-red-600';
    } else if (priority === 'medium') {
      return 'from-yellow-400 to-yellow-600';
    } else {
      switch (type) {
        case 'appointment':
          return 'from-blue-400 to-blue-600';
        case 'health':
          return 'from-pink-400 to-pink-600';
        case 'chat':
          return 'from-green-400 to-green-600';
        case 'reminder':
          return 'from-purple-400 to-purple-600';
        default:
          return 'from-gray-400 to-gray-600';
      }
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary" className="text-xs">Low</Badge>;
      default:
        return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('notifications.title')}
          </h1>
          <p className="text-gray-600">
            Stay updated with your maternal health journey
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-pink-600" />
            <span className="font-medium text-gray-900">All Notifications</span>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              {t('notifications.markAllRead')}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              const colorClass = getNotificationColor(notification.type, notification.priority);
              
              return (
                <Card
                  key={notification.id}
                  className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg cursor-pointer transition-all duration-200 hover:shadow-xl ${
                    !notification.isRead ? 'ring-2 ring-pink-200' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClass} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-sm ${
                          !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-400">
                            {notification.timestamp.toLocaleString()}
                          </span>
                          
                          {notification.isRead && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('notifications.noNotifications')}
              </h3>
              <p className="text-gray-500">
                You'll see important updates and reminders here
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Settings */}
        <Card className="mt-8 bg-gradient-to-r from-pink-100 to-purple-100 border-0">
          <CardHeader>
            <CardTitle className="text-lg text-center">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Appointment Reminders</h4>
                <p className="text-sm text-gray-600">Get notified 24 hours before appointments</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Health Tips</h4>
                <p className="text-sm text-gray-600">Daily pregnancy and wellness advice</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Chat Messages</h4>
                <p className="text-sm text-gray-600">Instant notifications from midwives</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Wellness Reminders</h4>
                <p className="text-sm text-gray-600">Hydration, exercise, and medication alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
