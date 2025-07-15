import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, Clock, Star, Filter, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BackButton from '../ui/BackButton';

interface Hospital {
  id: number;
  name: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  specialties: string[];
  openHours: string;
  emergency: boolean;
  osmId?: string;
}

const LocationFinder: React.FC = () => {
  const { t } = useTranslation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Mock hospital data
  const mockHospitals: Hospital[] = [
    {
      id: 1,
      name: 'Mulago National Referral Hospital',
      address: 'Mulago Hill, Kampala',
      phone: '+256 414 554 000',
      distance: 2.3,
      rating: 4.2,
      specialties: ['Maternity', 'Pediatrics', 'Emergency'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 2,
      name: 'Nakasero Hospital',
      address: 'Nakasero, Kampala',
      phone: '+256 312 531 000',
      distance: 1.8,
      rating: 4.5,
      specialties: ['Maternity', 'Gynecology', 'Neonatal'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 3,
      name: 'International Hospital Kampala',
      address: 'Namuwongo, Kampala',
      phone: '+256 312 200 400',
      distance: 3.1,
      rating: 4.7,
      specialties: ['Maternity', 'Obstetrics', 'Pediatrics'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 4,
      name: 'Mengo Hospital',
      address: 'Mengo, Kampala',
      phone: '+256 414 272 951',
      distance: 2.9,
      rating: 4.1,
      specialties: ['Maternity', 'Family Medicine'],
      openHours: '6:00 AM - 10:00 PM',
      emergency: false
    },
    {
      id: 5,
      name: 'Kiruddu National Referral Hospital',
      address: 'Kiruddu, Kampala',
      phone: '+256 414 272 100',
      distance: 4.2,
      rating: 3.9,
      specialties: ['Maternity', 'Pediatrics', 'Emergency'],
      openHours: '24/7',
      emergency: true
    },
    // Additional hospitals
    {
      id: 6,
      name: 'Case Hospital',
      address: 'Plot 67-71, Buganda Road, Kampala',
      phone: '+256 414 250 580',
      distance: 2.7,
      rating: 4.3,
      specialties: ['Maternity', 'Surgery', 'Cardiology'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 7,
      name: 'St. Francis Hospital Nsambya',
      address: 'Nsambya, Kampala',
      phone: '+256 414 267 012',
      distance: 3.5,
      rating: 4.0,
      specialties: ['Maternity', 'Orthopedics', 'Pediatrics'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 8,
      name: 'China-Uganda Friendship Hospital Naguru',
      address: 'Naguru, Kampala',
      phone: '+256 414 287 121',
      distance: 5.0,
      rating: 3.8,
      specialties: ['Maternity', 'General Medicine'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 9,
      name: 'Women’s Hospital International & Fertility Centre',
      address: 'Bukoto, Kampala',
      phone: '+256 414 222 610',
      distance: 4.8,
      rating: 4.6,
      specialties: ['Fertility', 'Maternity', 'Gynecology'],
      openHours: '8:00 AM - 8:00 PM',
      emergency: false
    },
    {
      id: 10,
      name: 'Victoria Hospital',
      address: 'Kira Road, Kampala',
      phone: '+256 312 200 600',
      distance: 3.9,
      rating: 4.4,
      specialties: ['Maternity', 'Surgery', 'ICU'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 11,
      name: 'Rubaga Hospital',
      address: 'Rubaga, Kampala',
      phone: '+256 414 270 008',
      distance: 5.2,
      rating: 4.1,
      specialties: ['Maternity', 'Pediatrics', 'General Medicine'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 12,
      name: 'Kampala Hospital',
      address: 'Kololo, Kampala',
      phone: '+256 312 563 400',
      distance: 2.5,
      rating: 4.5,
      specialties: ['Maternity', 'Surgery', 'Cardiology'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 13,
      name: 'Alpha Medical Centre',
      address: 'Kabalagala, Kampala',
      phone: '+256 414 510 888',
      distance: 6.1,
      rating: 3.7,
      specialties: ['General Medicine', 'Maternity'],
      openHours: '7:00 AM - 9:00 PM',
      emergency: false
    },
    {
      id: 14,
      name: 'Nile International Hospital',
      address: 'Jinja',
      phone: '+256 434 123 456',
      distance: 80.0,
      rating: 4.2,
      specialties: ['Maternity', 'Surgery', 'Pediatrics'],
      openHours: '24/7',
      emergency: true
    },
    {
      id: 15,
      name: 'Gulu Regional Referral Hospital',
      address: 'Gulu',
      phone: '+256 471 432 123',
      distance: 340.0,
      rating: 3.9,
      specialties: ['Maternity', 'General Medicine'],
      openHours: '24/7',
      emergency: true
    }
  ];

  // Fetch hospitals from OSM Nominatim API
  const fetchHospitalsFromOSM = async (query: string) => {
    setLoading(true);
    setApiError(null);
    try {
      // Use only q parameter and add 'Uganda' for better results
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ' Uganda')}&format=json&extratags=1&limit=20`;
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'MamaCareApp/1.0 (your-email@example.com)'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch from OSM');
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        setFilteredHospitals(mockHospitals);
        setLoading(false);
        return;
      }
      // Map OSM results to Hospital[]
      const results: Hospital[] = data.map((item: any, idx: number) => ({
        id: 10000 + idx, // avoid collision with mock ids
        name: item.display_name.split(',')[0],
        address: item.display_name,
        phone: item.extratags?.phone || '',
        distance: 0, // OSM does not provide distance
        rating: 4.0, // Placeholder
        specialties: ['General'], // Placeholder
        openHours: item.extratags?.opening_hours || 'Unknown',
        emergency: item.extratags?.emergency === 'yes',
        osmId: item.osm_id
      }));
      setFilteredHospitals(results);
    } catch (err) {
      setApiError('Could not fetch hospitals from OpenStreetMap. Showing local results.');
      setFilteredHospitals(mockHospitals);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
    // Set mock data
    setHospitals(mockHospitals);
    setFilteredHospitals(mockHospitals);
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      fetchHospitalsFromOSM(searchTerm.trim() + ' hospital');
    } else {
      // fallback to mock data and filters
      let filtered = hospitals;
      if (selectedFilter !== 'all') {
        switch (selectedFilter) {
          case 'emergency':
            filtered = filtered.filter(hospital => hospital.emergency);
            break;
          case 'maternity':
            filtered = filtered.filter(hospital => 
              hospital.specialties.includes('Maternity')
            );
            break;
          case 'nearby':
            filtered = filtered.filter(hospital => hospital.distance <= 3);
            break;
        }
      }
      filtered.sort((a, b) => a.distance - b.distance);
      setFilteredHospitals(filtered);
    }
  }, [searchTerm, selectedFilter, hospitals]);

  const getDirections = (hospital: Hospital) => {
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.name.replace(/\s+/g, '+')}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="pt-4 pl-4"><BackButton /></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            <MapPin size={32} />
            <h1 className="text-2xl font-bold">Find Nearby Hospitals</h1>
          </div>
          <p className="text-blue-100">
            Locate the nearest medical facilities for your maternal health needs
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Hospitals</option>
                <option value="emergency">Emergency Care</option>
                <option value="maternity">Maternity Focus</option>
                <option value="nearby">Nearby (≤3km)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin mr-2" />
            <span>Searching hospitals in Uganda...</span>
          </div>
        )}
        {apiError && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">
            {apiError}
          </div>
        )}

        {/* Hospital List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {hospital.name}
                  </h3>
                  {hospital.emergency && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Emergency
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    {hospital.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2" />
                    {hospital.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    {hospital.openHours}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="text-yellow-400 mr-1" size={16} />
                    <span className="text-sm font-medium">{hospital.rating}</span>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">
                    {hospital.distance}km away
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {hospital.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => getDirections(hospital)}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Navigation size={16} />
                    <span>Directions</span>
                  </button>
                  <button
                    onClick={() => window.open(`tel:${hospital.phone}`)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Phone size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No hospitals found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LocationFinder;