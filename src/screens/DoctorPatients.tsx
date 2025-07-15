import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Patient {
  id: string;
  name: string;
  contact: string;
  problem: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DoctorPatients: React.FC = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/doctors/patients/${user.id}`);
        if (!res.ok) throw new Error('Failed to fetch patients');
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e.message || 'Error fetching patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [user]);

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4 text-blue-700">Patient List</h2>
      <p className="mb-6">Track your patients' details and health concerns below.</p>
      {loading ? (
        <div className="text-blue-600 py-4">Loading patients...</div>
      ) : error ? (
        <div className="text-red-600 py-4">{error}</div>
      ) : patients.length === 0 ? (
        <div className="text-gray-500 py-4">No patients found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-100">
          <table className="min-w-full text-left">
            <thead className="bg-blue-50">
              <tr>
                <th className="py-3 px-4 font-semibold text-blue-900">Name</th>
                <th className="py-3 px-4 font-semibold text-blue-900">Contact</th>
                <th className="py-3 px-4 font-semibold text-blue-900">Problem</th>
                <th className="py-3 px-4 font-semibold text-blue-900">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="border-b hover:bg-blue-50">
                  <td className="py-2 px-4">{patient.name}</td>
                  <td className="py-2 px-4">{patient.contact ? patient.contact : '-'}</td>
                  <td className="py-2 px-4">{patient.problem || '-'}</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-600 hover:underline font-medium">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;
