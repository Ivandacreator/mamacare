import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC<{ className?: string; to?: string }> = ({ className, to }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className={`flex items-center gap-2 px-4 py-2 text-pink-700 hover:text-pink-900 font-semibold bg-pink-50 hover:bg-pink-100 rounded transition-colors shadow-sm mb-4 ${className || ''}`}
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
      Back
    </button>
  );
};

export default BackButton; 