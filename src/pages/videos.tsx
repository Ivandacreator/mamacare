import React from 'react';
import { motion } from 'framer-motion';
import { Video, Play, Clock, Filter, Search, Eye, Heart, Calendar } from 'lucide-react';
import { useState } from 'react';

// Video interface
interface VideoData {
  id: number;
  title: string;
  expert: string;
  url: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  viewCount?: number;
  likeCount?: number;
  publishedAt?: string;
}

// Fallback static videos in case API fails
const fallbackVideos: VideoData[] = [
  {
    id: 1,
    title: 'Prenatal Care Essentials',
    expert: 'Dr. Jane Smith, OBGYN',
    url: 'https://www.youtube.com/embed/eoK_RAAg4BQ',
    description: 'A comprehensive guide to essential prenatal care for a healthy pregnancy.',
    thumbnail: 'https://img.youtube.com/vi/eoK_RAAg4BQ/hqdefault.jpg',
    duration: '14:32',
    category: 'prenatal'
  },
  {
    id: 2,
    title: 'Breastfeeding: Act Now',
    expert: 'Dr. Jennifer Lee, Lactation Consultant',
    url: 'https://www.youtube.com/embed/eMmQ5fCIYJQ?start=49',
    description: 'Learn about the importance of breastfeeding and how to get started.',
    thumbnail: 'https://img.youtube.com/vi/eMmQ5fCIYJQ/hqdefault.jpg',
    duration: '10:05',
    category: 'breastfeeding'
  },
  {
    id: 3,
    title: 'Labor and Delivery Preparation',
    expert: 'Dr. Lisa Thompson, Labor & Delivery Specialist',
    url: 'https://www.youtube.com/embed/Q6213lkGvyc',
    description: 'Everything you need to know about preparing for labor and delivery.',
    thumbnail: 'https://img.youtube.com/vi/Q6213lkGvyc/hqdefault.jpg',
    duration: '18:20',
    category: 'labor-delivery'
  }
];

function extractYouTubeId(url: string) {
  // Extracts the YouTube video ID from embed URL
  const match = url.match(/embed\/([\w-]+)/);
  return match ? match[1] : '';
}

// Format view count
function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

const Videos: React.FC = () => {
  const [videos, setVideos] = React.useState<VideoData[]>(fallbackVideos);
  const [loading, setLoading] = React.useState(false); // No loading since no API
  const [error, setError] = React.useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = React.useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredVideos, setFilteredVideos] = useState<VideoData[]>(fallbackVideos);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('error'); // Always fallback

  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'prenatal', name: 'Prenatal Care' },
    { id: 'nutrition', name: 'Nutrition' },
    { id: 'postnatal', name: 'Postnatal Care' },
    { id: 'exercise', name: 'Exercise & Yoga' },
    { id: 'labor-delivery', name: 'Labor & Delivery' },
    { id: 'mental-health', name: 'Mental Health' },
    { id: 'breastfeeding', name: 'Breastfeeding' },
    { id: 'newborn-care', name: 'Newborn Care' }
  ];

  // Filter videos based on search term and category
  React.useEffect(() => {
    let filtered = fallbackVideos;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(video => video.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.expert.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredVideos(filtered);
  }, [searchTerm, selectedCategory]);

  // Remove API fetch logic
  // React.useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       setLoading(true);
  //       setApiStatus('loading');
        
  //       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/videos`);
        
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
        
  //       const data = await response.json();
        
  //       if (Array.isArray(data) && data.length > 0) {
  //         setVideos(data);
  //         setFilteredVideos(data);
  //         setApiStatus('success');
  //       } else {
  //         throw new Error('No videos returned from API');
  //       }
        
  //       setLoading(false);
  //     } catch (err) {
  //       console.error('Error fetching videos:', err);
  //       setError('Could not load videos from YouTube API. Showing fallback videos.');
  //       setVideos(fallbackVideos);
  //       setFilteredVideos(fallbackVideos);
  //       setApiStatus('error');
  //       setLoading(false);
  //     }
  //   };

  //   fetchVideos();
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-xl shadow-md p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 mb-8 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
            <Video size={32} />
            <h1 className="text-2xl font-bold">Expert Videos</h1>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center space-x-2">
              {apiStatus === 'loading' && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Loading from YouTube...</span>
                </div>
              )}
              {apiStatus === 'success' && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Live from YouTube</span>
                </div>
              )}
              {apiStatus === 'error' && (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>Using fallback videos</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search videos, experts, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter size={20} className="text-gray-600" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
              <div className="text-lg text-gray-600">Loading videos from YouTube...</div>
            </div>
          )}
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-yellow-800">{error}</span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                To enable YouTube integration, set up your YouTube Data API v3 key in the backend .env file.
              </p>
            </div>
          )}
          
          {filteredVideos.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-10">
              <Video size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No videos found matching your search criteria.</p>
              <p className="text-sm">Try adjusting your search terms or category filter.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * video.id }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  {selectedVideo === video.id ? (
                    <iframe
                      src={video.url + '?autoplay=1'}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-48 md:h-40 lg:h-48"
                    ></iframe>
                  ) : (
                    <button
                      className="w-full h-48 md:h-40 lg:h-48 flex flex-col items-center justify-center group relative overflow-hidden"
                      onClick={() => setSelectedVideo(video.id)}
                    >
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${extractYouTubeId(video.url)}/hqdefault.jpg`}
                        alt={video.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300"></div>
                      <span className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:bg-opacity-100 transition-all duration-300">
                          <Play size={24} className="text-pink-600 ml-1" />
                        </div>
                      </span>
                      {video.duration && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </span>
                      )}
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2">{video.title}</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <span className="font-medium">By {video.expert}</span>
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-2 mb-3">{video.description}</p>
                  
                  {/* Video Stats */}
                  <div className="flex items-center justify-between mb-3 text-xs text-gray-500">
                    {video.viewCount && (
                      <div className="flex items-center space-x-1">
                        <Eye size={12} />
                        <span>{formatViewCount(video.viewCount)}</span>
                      </div>
                    )}
                    {video.likeCount && (
                      <div className="flex items-center space-x-1">
                        <Heart size={12} />
                        <span>{formatViewCount(video.likeCount)}</span>
                      </div>
                    )}
                    {video.publishedAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} />
                        <span>{formatDate(video.publishedAt)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full font-medium">
                      {video.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock size={12} className="mr-1" />
                      {video.duration}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Videos;



