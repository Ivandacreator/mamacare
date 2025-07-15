import React, { useEffect, useState, useRef, useCallback, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, User, UserCheck, Mic, Phone, Video } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface Message {
  user: string;
  text: string;
  time: string;
  mother_name?: string;
  sender?: string;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function getIds() {
  const params = new URLSearchParams(window.location.search);
  const doctor_id = params.get('doctor_id') || '1';
  const mother_id = params.get('mother_id') || '2';
  return { doctor_id, mother_id };
}

function getRoomId(doctor_id: string, mother_id: string) {
  return `room_${[doctor_id, mother_id].sort().join('_')}`;
}

const ChatRealtimePage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const { doctor_id, mother_id } = getIds();
  const roomId = getRoomId(doctor_id, mother_id);
  const chatPartnerId = user?.role === 'doctor' ? mother_id : doctor_id;
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video' | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // WebRTC state/refs
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [remoteUser, setRemoteUser] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'ringing' | 'in-call' | 'ended'>('idle');

  // Toast
  const toastRef = useRef<HTMLParagraphElement>(null);
  const [notification, setNotification] = useState<string>('');

  // --- Socket.IO setup ---
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    if (user?.id) {
      socket.emit('userOnline', { userId: user.id, role: user.role });
    }

    socket.on('connect', () => {
      socket.emit('joinRoom', { roomId, user: user?.name || 'Anonymous' });
    });

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

    socket.on('receiveMessage', (message: Message) => {
      const displayUser = message.mother_name ? message.mother_name : (message.sender || message.user);
      setMessages((prev) => [...prev, { ...message, user: displayUser }]);
      if (document.visibilityState !== 'visible') {
        toast({
          title: 'New Message',
          description: `${displayUser}: ${message.text}`,
        });
      } else {
        const chatDiv = messagesEndRef.current?.parentElement;
        if (chatDiv && chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight > 100) {
          toast({
            title: 'New Message',
            description: `${displayUser}: ${message.text}`,
          });
        }
      }
    });

    socket.on('typing', ({ user: typingName }) => {
      if (typingName !== user?.name) {
        setTypingUser(typingName);
        setTimeout(() => setTypingUser(null), 2000);
      }
    });

    socket.on('onlineUsers', (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    // For username change, disconnect, etc.
    socket.on('getId', (idOfSocket: string) => {});
    socket.on('countUsers', (onlineUsers: number) => {});
    socket.on('resetChat', () => {});
    socket.on('message', (message: string) => {
      setNotification(message);
      showToast('green');
    });

    return () => {
      if (user?.id) {
        socket.emit('userOffline', { userId: user.id });
      }
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [user, doctor_id, mother_id, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- Chat send/typing ---
  const sendMessage = () => {
    if (input.trim() && socketRef.current && user) {
      const message: Message = {
        user: user.name,
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socketRef.current.emit('sendMessage', {
        roomId,
        message,
        senderId: user.id,
        senderRole: user.role,
        doctor_id,
        mother_id
      });
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (socketRef.current && user) {
      socketRef.current.emit('typing', { roomId, user: user.name });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (socketRef.current && user) {
      socketRef.current.emit('typing', { roomId, user: user.name });
    }
  };

  // Voice input logic (Web Speech API)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast({ title: 'Not Supported', description: 'Speech recognition is not supported in this browser.' });
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev: string) => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  // --- Call modal handlers (UI only, no WebRTC for brevity) ---
  const openCallModal = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsCallModalOpen(true);
  };
  const closeCallModal = () => {
    setIsCallModalOpen(false);
    setCallType(null);
  };

  // Determine if chat partner is online
  const isPartnerOnline = onlineUsers.includes(chatPartnerId);

  // Toast helper
  function showToast(bgColor: string) {
    if (toastRef.current) {
      toastRef.current.className = 'show';
      toastRef.current.style.backgroundColor = bgColor;
      setTimeout(() => {
        if (toastRef.current) {
          toastRef.current.className = toastRef.current.className.replace('show', '');
        }
      }, 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Live Chatroom
          </h1>
          <p className="text-gray-600">Chat live with doctors and mothers</p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-[600px] flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-pink-600" />
                <span>Live Chatroom</span>
              </div>
              <div className="flex items-center space-x-2">
                {isPartnerOnline ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Partner Online</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600">Partner Offline</span>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.user === user?.name ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.user === user?.name ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.user === user?.name
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600' 
                        : 'bg-gradient-to-r from-green-400 to-green-600'
                    }`}>
                      {message.user === user?.name ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.user === user?.name
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm break-words">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.user === user?.name ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {typingUser && (
                <div className="text-xs text-gray-500 italic mb-2">{typingUser} is typing...</div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input + Call/Voice Controls */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceInput}
                  className={isListening ? 'bg-pink-100 animate-pulse' : ''}
                  title="Voice Input"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openCallModal('audio')}
                  title="Start Audio Call"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openCallModal('video')}
                  title="Start Video Call"
                >
                  <Video className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border-pink-200 focus:border-pink-400"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Send</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Call Modal (UI only) */}
        <Dialog open={isCallModalOpen} onOpenChange={closeCallModal}>
          <DialogContent className="max-w-lg w-full">
            <DialogTitle>{callType === 'video' ? 'Video Call' : 'Audio Call'}</DialogTitle>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-gray-500">
                  {callType === 'video' ? 'Video Call' : 'Audio Call'} (UI only)
                </span>
              </div>
              <Button variant="outline" onClick={closeCallModal}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* TOAST NOTIFICATION */}
        <p id="toast" ref={toastRef}>{notification}</p>
      </div>
    </div>
  );
};

export default ChatRealtimePage;