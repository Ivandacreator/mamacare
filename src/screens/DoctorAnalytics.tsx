import React from 'react';
import { TrendingUp, Users, Calendar, AlertTriangle, Heart } from 'lucide-react';
//port { Analytics } from '../../types';
import { mockAnalytics } from '../../utils/mockData';

const AnalyticsDashboard: React.FC = () => {
  const analytics = mockAnalytics;

  const chartData = analytics.monthlyAppointments.map((value, index) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
    appointments: value
  }));

  const maxAppointments = Math.max(...analytics.monthlyAppointments);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Export Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            View Details
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalPatients}</p>
              <p className="text-sm text-green-600">↗ 12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Appointments Today</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.appointmentsToday}</p>
              <p className="text-sm text-blue-600">5 completed, 3 pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
            
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Unread Messages</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.unreadMessages}</p>
              <p className="text-sm text-orange-600">3 urgent responses needed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.criticalAlerts}</p>
              <p className="text-sm text-red-600">Immediate attention required</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Appointments Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Appointments</h3>
            <p className="text-sm text-gray-500">Appointment trends over the past year</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex items-center space-x-4">
                  <div className="w-8 text-sm text-gray-500">{data.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{
                        width: `${(data.appointments / maxAppointments) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-gray-700 text-right">{data.appointments}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Patient Risk Distribution</h3>
            <p className="text-sm text-gray-500">Current risk level breakdown</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full">
                  <div className="text-white">
                    <div className="text-2xl font-bold">{analytics.totalPatients}</div>
                    <div className="text-sm">Total Patients</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Low Risk</span>
                  </div>
                  <span className="text-sm text-gray-600">{analytics.riskDistribution.low} patients</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Medium Risk</span>
                  </div>
                  <span className="text-sm text-gray-600">{analytics.riskDistribution.medium} patients</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">High Risk</span>
                  </div>
                  <span className="text-sm text-gray-600">{analytics.riskDistribution.high} patients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Average Pregnancy Week</h3>
          </div>
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{analytics.averagePregnancyWeek}</div>
            <p className="text-sm text-gray-500">weeks average</p>
            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-700">Most patients are in their second trimester</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Patient Satisfaction</h3>
          </div>
          <div className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <div className="text-3xl font-bold text-gray-900">{analytics.patientSatisfaction}</div>
              <div className="text-gray-500">/5.0</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Based on 127 reviews</p>
            <div className="mt-4 flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(analytics.patientSatisfaction)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ⭐
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New Patients</span>
                <span className="text-sm font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Completed Visits</span>
                <span className="text-sm font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Cancelled</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">No Shows</span>
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">15% increase from last month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New patient Sarah Wilson registered</span>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Appointment completed with Emily Davis</span>
              <span className="text-xs text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Critical alert resolved for Maria Rodriguez</span>
              <span className="text-xs text-gray-400">6 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Lab results uploaded for 3 patients</span>
              <span className="text-xs text-gray-400">8 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;