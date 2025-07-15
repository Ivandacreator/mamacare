import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/doctor-dashboard', label: 'Dashboard' },
  { to: '/doctor-dashboard/patients', label: 'Patients' },
  { to: '/doctor-dashboard/appointments', label: 'Appointments' },
  { to: '/doctor-dashboard/chat', label: 'Chat' },
  { to: '/doctor-dashboard/alerts', label: 'Alerts' },
  { to: '/doctor-dashboard/content', label: 'Content' },
  { to: '/doctor-dashboard/symptoms', label: 'Symptoms' },
  { to: '/doctor-dashboard/analytics', label: 'Analytics' },
  { to: '/doctor-dashboard/map', label: 'Map' },
  { to: '/doctor-dashboard/settings', label: 'Settings' },
];

const DoctorNav: React.FC = () => (
  <nav className="bg-white shadow p-4 flex gap-4 rounded-xl mb-6">
    {navItems.map(item => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          isActive ? 'text-blue-600 font-bold underline' : 'text-gray-700 hover:text-blue-500'}
      >
        {item.label}
      </NavLink>
    ))}
  </nav>
);

export default DoctorNav;
