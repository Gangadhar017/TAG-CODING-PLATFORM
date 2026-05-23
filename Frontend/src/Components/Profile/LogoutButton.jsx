import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { logoutUser } from '../../Services/Auth.service';

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const result = logoutUser();
    if (result) {
      navigate('/login');
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      className="w-full py-2.5 font-outfit font-semibold text-[15px] text-red-400 hover:text-white bg-red-950/20 hover:bg-red-600 border border-red-900/40 hover:border-red-500 rounded-2xl shadow-sm transition-all duration-300 transform hover:-translate-y-0.5"
    >
      Sign Out
    </button>
  );
};

export default LogoutButton;
