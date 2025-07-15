import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Baby, Activity, Heart, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TrimesterInfo {
  id: number;
  title: string;
  weeks: string;
  description: string;
  keyChanges: string[];
  babyDevelopment: string[];
  symptoms: string[];
  tips: string[];
  appointments: string[];
}

const Trimester: React.FC = () => {
  const { t } = useTranslation();
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(1);

  const trimesterData: Record<number, TrimesterInfo> = {
    1: {
      id: 1,
      title: 'First Trimester',
      weeks: 'Weeks 1-12',
      description: 'The foundation of your pregnancy journey. Your body is adapting to major changes, and your baby\'s vital organs are forming.',
      keyChanges: [
        'Missed period and positive pregnancy test',
        'Increased hormone production (hCG, progesterone)',
        'Breast tenderness and enlargement',
        'Increased urination frequency',
        'Fatigue and mood changes'
      ],
      babyDevelopment: [
        'Neural tube forms (becomes brain and spinal cord)',
        'Heart begins to beat (around week 6)',
        'Limb buds appear and develop',
        'Facial features start forming',
        'Major organs begin development'
      ],
      symptoms: [
        'Morning sickness (nausea/vomiting)',
        'Extreme fatigue',
        'Food aversions and cravings',
        'Heightened sense of smell',
        'Emotional changes'
      ],
      tips: [
        'Take prenatal vitamins with folic acid',
        'Eat small, frequent meals',
        'Stay hydrated',
        'Get plenty of rest',
        'Avoid alcohol, smoking, and harmful substances'
      ],
      appointments: [
        'First prenatal visit (8-10 weeks)',
        'Blood tests and urine analysis',
        'Dating ultrasound',
        'Genetic counseling if needed',
        'Discuss lifestyle changes'
      ]
    },
    2: {
      id: 2,
      title: 'Second Trimester',
      weeks: 'Weeks 13-27',
      description: 'Often called the "golden period" of pregnancy. Many uncomfortable symptoms subside, and you\'ll likely feel more energetic.',
      keyChanges: [
        'Morning sickness typically improves',
        'Increased energy levels',
        'Growing belly becomes noticeable',
        'Skin changes (darkening, stretch marks)',
        'Weight gain increases'
      ],
      babyDevelopment: [
        'Organs continue to mature',
        'Baby can hear sounds',
        'Movement becomes more coordinated',
        'Fingerprints develop',
        'Baby can suck thumb and make facial expressions'
      ],
      symptoms: [
        'Reduced nausea and vomiting',
        'Increased appetite',
        'Backaches and round ligament pain',
        'Shortness of breath',
        'Varicose veins may appear'
      ],
      tips: [
        'Continue prenatal vitamins',
        'Stay active with approved exercises',
        'Wear supportive maternity clothes',
        'Practice good posture',
        'Consider childbirth education classes'
      ],
      appointments: [
        'Regular prenatal visits (every 4 weeks)',
        'Anatomy ultrasound (18-20 weeks)',
        'Glucose screening test',
        'Blood pressure monitoring',
        'Fundal height measurements'
      ]
    },
    3: {
      id: 3,
      title: 'Third Trimester',
      weeks: 'Weeks 28-40',
      description: 'The final stretch! Your baby is preparing for birth, and you\'re getting ready to meet your little one.',
      keyChanges: [
        'Rapid weight gain',
        'Increased discomfort and fatigue',
        'Braxton Hicks contractions',
        'Difficulty sleeping',
        'Frequent urination returns'
      ],
      babyDevelopment: [
        'Rapid brain development',
        'Lungs mature for breathing',
        'Baby gains weight quickly',
        'Movement space becomes limited',
        'Baby moves into head-down position'
      ],
      symptoms: [
        'Heartburn and indigestion',
        'Swelling in hands and feet',
        'Hip and pelvic pain',
        'Trouble sleeping',
        'Increased vaginal discharge'
      ],
      tips: [
        'Monitor baby\'s movements',
        'Prepare for breastfeeding',
        'Pack your hospital bag',
        'Practice relaxation techniques',
        'Discuss birth plan with your doctor'
      ],
      appointments: [
        'More frequent visits (every 2 weeks, then weekly)',
        'Group B Strep test',
        'Cervical checks',
        'Non-stress tests if needed',
        'Discuss delivery options'
      ]
    }
  };

  const currentTrimester = trimesterData[selectedTrimester];

  const trimesterColors = {
    1: 'from-pink-500 to-purple-600',
    2: 'from-blue-500 to-purple-600',
    3: 'from-green-500 to-blue-600'
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${trimesterColors[selectedTrimester]} rounded-xl p-6 mb-8 text-white`}>
          <div className="flex items-center space-x-3 mb-2">
            <BookOpen size={32} />
            <h1 className="text-2xl font-bold">Trimester Information</h1>
          </div>
          <p className="text-white text-opacity-90">
            Comprehensive guide to your pregnancy journey
          </p>
        </div>

        {/* Trimester Selector */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {[1, 2, 3].map((trimester) => (
              <motion.button
                key={trimester}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTrimester(trimester as 1 | 2 | 3)}
                className={`flex-1 p-4 rounded-lg text-left transition-all ${
                  selectedTrimester === trimester
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedTrimester === trimester ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                  }`}>
                    <span className="font-bold">{trimester}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Trimester {trimester}</h3>
                    <p className={`text-sm ${
                      selectedTrimester === trimester ? 'text-white text-opacity-80' : 'text-gray-500'
                    }`}>
                      {trimester === 1 ? 'Weeks 1-12' : trimester === 2 ? 'Weeks 13-27' : 'Weeks 28-40'}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Trimester Content */}
        <motion.div
          key={selectedTrimester}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Overview</h2>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {currentTrimester.title}
                </h3>
                <p className="text-gray-600 mb-4">{currentTrimester.description}</p>
                <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{currentTrimester.weeks}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Key Changes */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Activity size={24} className="text-green-600" />
                <h2 className="text-xl font-bold text-gray-800">Key Changes</h2>
              </div>
              <div className="space-y-3">
                {currentTrimester.keyChanges.map((change, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{change}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Baby Development */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Baby size={24} className="text-purple-600" />
                <h2 className="text-xl font-bold text-gray-800">Baby Development</h2>
              </div>
              <div className="space-y-3">
                {currentTrimester.babyDevelopment.map((development, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Heart size={16} className="text-purple-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{development}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Symptoms */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <Activity size={24} className="text-orange-600" />
                <h2 className="text-xl font-bold text-gray-800">Common Symptoms</h2>
              </div>
              <div className="space-y-3">
                {currentTrimester.symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm">{symptom}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Recommendations */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen size={24} className="text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Tips & Recommendations</h2>
              </div>
              <div className="space-y-3">
                {currentTrimester.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Appointments & Tests */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar size={24} className="text-red-600" />
              <h2 className="text-xl font-bold text-gray-800">Appointments & Tests</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentTrimester.appointments.map((appointment, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle size={16} className="text-red-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">{appointment}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Trimester;