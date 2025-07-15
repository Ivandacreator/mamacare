import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Symptom } from '../../types';
import { mockSymptoms } from '../../utils/mockData';

const SymptomsTracker: React.FC = () => {
  const [symptoms] = useState<Symptom[]>(mockSymptoms);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'moderate': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'severe': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredSymptoms = symptoms.filter(symptom => {
    const matchesSearch = symptom.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         symptom.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || symptom.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const symptomCounts = {
    total: symptoms.length,
    severe: symptoms.filter(s => s.severity === 'severe').length,
    unresolved: symptoms.filter(s => !s.resolved).length,
    today: symptoms.filter(s => s.date === new Date().toISOString().split('T')[0]).length
  };

  // Group symptoms by type for trends
  const symptomTrends = symptoms.reduce((acc, symptom) => {
    acc[symptom.symptom] = (acc[symptom.symptom] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSymptoms = Object.entries(symptomTrends)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Symptoms Tracker</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Log Symptom</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{symptomCounts.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Severe Cases</p>
              <p className="text-2xl font-bold text-gray-900">{symptomCounts.severe}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unresolved</p>
              <p className="text-2xl font-bold text-gray-900">{symptomCounts.unresolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Reports</p>
              <p className="text-2xl font-bold text-gray-900">{symptomCounts.today}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Symptoms List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Symptoms</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Severities</option>
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredSymptoms.map((symptom) => (
              <div key={symptom.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-gray-900">{symptom.symptom}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getSeverityColor(symptom.severity)}`}>
                        {getSeverityIcon(symptom.severity)}
                        <span>{symptom.severity}</span>
                      </span>
                      {symptom.resolved && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Patient: {symptom.patientName}</p>
                    <p className="text-sm text-gray-500">Date: {symptom.date}</p>
                    {symptom.notes && (
                      <p className="text-sm text-gray-600 mt-2">{symptom.notes}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Edit
                    </button>
                    {!symptom.resolved && (
                      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trends and Analytics */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Symptoms</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topSymptoms.map(([symptom, count], index) => (
                  <div key={symptom} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{symptom}</span>
                    </div>
                    <span className="text-sm text-gray-500">{count} reports</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Severity Distribution</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {['mild', 'moderate', 'severe'].map(severity => {
                  const count = symptoms.filter(s => s.severity === severity).length;
                  const percentage = (count / symptoms.length * 100).toFixed(1);
                  return (
                    <div key={severity}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{severity}</span>
                        <span>{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            severity === 'mild' ? 'bg-green-500' :
                            severity === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Export Symptoms Report
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                View Trends Analysis
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Generate Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomsTracker;