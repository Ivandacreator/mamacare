import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BackButton from '../ui/BackButton';

const features = [
  {
    title: 'Connect with Doctors Instantly',
    description: 'Chat in real-time with certified maternal health professionals and get answers to your questions anytime.',
    icon: '💬',
  },
  {
    title: 'Personalized Health Tips',
    description: 'Receive daily, trimester-specific tips and reminders to keep you and your baby healthy.',
    icon: '🌱',
  },
  {
    title: 'AI Support 24/7',
    description: 'Ask our AI assistant anything about pregnancy, symptoms, nutrition, and more—anytime, anywhere.',
    icon: '🤖',
  },
  {
    title: 'Appointment Tracking',
    description: 'Never miss a checkup! Track and manage your doctor appointments with ease.',
    icon: '📅',
  },
  {
    title: 'Emergency Alerts',
    description: 'Send instant SOS alerts to your doctor in case of emergencies.',
    icon: '🚨',
  },
];

const testimonials = [
  {
    name: 'Sarah K.',
    text: 'MamaCare made my pregnancy journey so much easier. I loved the daily tips and being able to chat with my doctor anytime!',
  },
  {
    name: 'Dr. James W.',
    text: 'As a doctor, MamaCare helps me stay connected with my patients and provide timely advice. Highly recommended!',
  },
];

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-4 relative overflow-hidden">
      {/* Highly Customized Animated SVG Blobs Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        {/* Blob 1 */}
        <motion.svg
          className="absolute top-[-10%] left-[-15%] opacity-50"
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 30, -20, 0],
            y: [0, 20, -10, 0],
            rotate: [0, 10, -8, 0],
          }}
          transition={{ repeat: Infinity, duration: 22, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="blob1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <path d="M400,220Q420,320,320,400Q220,480,120,400Q20,320,60,200Q100,80,220,60Q340,40,400,120Q460,200,400,220Z" fill="url(#blob1)" />
        </motion.svg>
        {/* Blob 2 */}
        <motion.svg
          className="absolute bottom-[-12%] right-[-10%] opacity-40"
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            scale: [1, 1.08, 1],
            x: [0, -20, 30, 0],
            y: [0, 15, -10, 0],
            rotate: [0, -8, 8, 0],
          }}
          transition={{ repeat: Infinity, duration: 26, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="blob2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <path d="M320,140Q340,240,240,320Q140,400,60,320Q-20,240,40,140Q100,40,220,60Q340,80,320,140Z" fill="url(#blob2)" />
        </motion.svg>
        {/* Blob 3 */}
        <motion.svg
          className="absolute top-[30%] left-[-8%] opacity-30"
          width="220"
          height="220"
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            scale: [1, 1.06, 1],
            x: [0, 10, -8, 0],
            y: [0, -10, 8, 0],
            rotate: [0, 6, -6, 0],
          }}
          transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="blob3" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <path d="M180,90Q200,150,140,180Q80,210,40,160Q0,110,40,60Q80,10,140,40Q200,70,180,90Z" fill="url(#blob3)" />
        </motion.svg>
        {/* Blob 4 */}
        <motion.svg
          className="absolute bottom-[18%] left-[10%] opacity-25"
          width="180"
          height="180"
          viewBox="0 0 180 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 1, x: 0, y: 0, rotate: 0 }}
          animate={{
            scale: [1, 1.04, 1],
            x: [0, 8, -6, 0],
            y: [0, 6, -8, 0],
            rotate: [0, -4, 4, 0],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="blob4" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.2" />
            </radialGradient>
          </defs>
          <path d="M140,70Q160,120,100,140Q40,160,20,100Q0,40,60,20Q120,0,140,50Q160,100,140,70Z" fill="url(#blob4)" />
        </motion.svg>
        {/* Blob 5 (center, subtle) */}
        <motion.svg
          className="absolute top-[40%] left-[50%] opacity-15"
          style={{ transform: 'translate(-50%, -50%)' }}
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ scale: 1, rotate: 0 }}
          animate={{
            scale: [1, 1.03, 1],
            rotate: [0, 3, -3, 0],
          }}
          transition={{ repeat: Infinity, duration: 32, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="blob5" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <path d="M500,300Q550,450,300,550Q50,650,100,400Q150,150,400,100Q650,50,500,300Z" fill="url(#blob5)" />
        </motion.svg>
      </div>
      {/* Main Content (z-10 to ensure above blobs) */}
      <div className="relative z-10 w-full max-w-2xl pt-4 pl-4"><BackButton /></div>
      <motion.div
        className="max-w-2xl w-full bg-white/80 rounded-xl shadow-lg p-8 text-center backdrop-blur-md relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.h1
          className="text-5xl font-extrabold text-pink-700 mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to MamaCare
        </motion.h1>
        <motion.p
          className="text-lg text-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          MamaCare is your comprehensive maternal health companion. Connect with doctors, access health tips, track appointments, chat in real-time, and get AI-powered support—all in one place. Our mission is to empower mothers and healthcare providers for a healthier, happier pregnancy journey.
        </motion.p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
          <Link to="/login" className="px-8 py-3 bg-pink-600 text-white rounded-lg font-semibold shadow hover:bg-pink-700 transition-colors text-lg">Log In</Link>
          <Link to="/register" className="px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition-colors text-lg">Sign Up</Link>
        </div>
      </motion.div>

      {/* Animated Feature Highlights */}
      <div className="max-w-4xl w-full mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            className="bg-white/90 rounded-lg shadow p-6 flex items-center gap-4 hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
          >
            <span className="text-4xl">{feature.icon}</span>
            <div className="text-left">
              <div className="font-bold text-lg text-pink-700">{feature.title}</div>
              <div className="text-gray-600">{feature.description}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="max-w-2xl w-full mt-16">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">What Our Users Say</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              className="bg-white/90 rounded-lg shadow p-6 flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 * idx, duration: 0.5 }}
            >
              <div className="italic text-gray-700 mb-2">"{t.text}"</div>
              <div className="font-semibold text-pink-600">- {t.name}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h3 className="text-2xl font-bold text-pink-700 mb-2">Ready to start your journey?</h3>
        <p className="text-gray-700 mb-4">Join MamaCare today and experience the future of maternal health support.</p>
        <Link to="/register" className="px-10 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition-transform text-lg">Get Started</Link>
      </motion.div>

      <footer className="mt-16 text-gray-500 text-sm">&copy; {new Date().getFullYear()} MamaCare. All rights reserved.</footer>
    </div>
  );
};

export default WelcomePage; 