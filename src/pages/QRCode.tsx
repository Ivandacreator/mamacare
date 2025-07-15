import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Smartphone, QrCode as QrCodeIcon } from 'lucide-react';
import QRCodeLib from 'qrcode';

const QRCode: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [appUrl] = useState(() => {
    // Use the current origin to ensure it works in development and production
    const baseUrl = window.location.origin;
    return `${baseUrl}/login`;
  });

  useEffect(() => {
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCodeLib.toDataURL(appUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#E91E63',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = 'mamacare-app-qr-code.png';
    link.href = qrCodeUrl;
    link.click();
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MamaCare App',
          text: 'Download the MamaCare app for comprehensive maternal health support',
          url: appUrl
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(appUrl);
      alert('App link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <QrCodeIcon size={32} />
            <h1 className="text-2xl font-bold">Download MamaCare App</h1>
          </div>
          <p className="text-pink-100">
            Scan the QR code to download our mobile app for the best experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Scan QR Code
            </h2>
            
            {qrCodeUrl && (
              <div className="mb-6">
                <img
                  src={qrCodeUrl}
                  alt="MamaCare App QR Code"
                  className="mx-auto rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadQRCode}
                className="flex items-center justify-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download size={20} />
                <span>Download QR</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={shareQRCode}
                className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Share2 size={20} />
                <span>Share App</span>
              </motion.button>
            </div>
          </motion.div>

          {/* App Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone size={24} className="text-pink-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Mobile App Features
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Expert Video Library</h3>
                  <p className="text-sm text-gray-600">
                    Access comprehensive pregnancy and maternal health videos
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">AI Health Assistant</h3>
                  <p className="text-sm text-gray-600">
                    Get personalized health advice and answers to your questions
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Appointment Management</h3>
                  <p className="text-sm text-gray-600">
                    Schedule and track your prenatal appointments easily
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Health Tracking</h3>
                  <p className="text-sm text-gray-600">
                    Monitor your pregnancy progress and health metrics
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Emergency Features</h3>
                  <p className="text-sm text-gray-600">
                    Quick access to emergency contacts and medical information
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Installation Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            How to Install
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">📱 On Mobile</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Open your phone's camera app</li>
                <li>2. Point the camera at the QR code</li>
                <li>3. Tap the notification that appears</li>
                <li>4. Follow the installation prompts</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">💻 On Desktop</h3>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Visit the app URL in your browser</li>
                <li>2. Look for the "Install" button</li>
                <li>3. Click "Add to Home Screen"</li>
                <li>4. Enjoy the full app experience</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QRCode;



