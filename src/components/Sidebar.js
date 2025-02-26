import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = ({ onSectionChange, activeSection, profileCreated }) => {
  const [userEmail, setUserEmail] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile-container')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    // Clear all storage including profile data
    localStorage.clear();
    navigate('/login');
  };
  
  const handleNavigation = (section) => {
    // Call the parent handler to change the section
    if (onSectionChange) {
      onSectionChange(section);
    }
    // No need to navigate here as the Dashboard component handles this
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-title">Referral Manager</div>
        
        <div className="sidebar-menu">
          <div
            className={`sidebar-menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard')}
          >
            <span className="menu-icon">🏠</span>
            <span>Home</span>
          </div>
          
          {profileCreated && (
            <div
              className={`sidebar-menu-item ${activeSection === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavigation('profile')}
            >
              <span className="menu-icon">👤</span>
              <span>Profile</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="sidebar-bottom">
        <div className="user-profile-container">
          <div 
            className="user-profile"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="user-circle">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="user-info">
              <span className="user-email">{userEmail || "No Email"}</span>
            </div>
          </div>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <div 
                className="dropdown-item"
                onClick={() => {
                  navigate('/account');
                  setIsProfileOpen(false);
                }}
              >
                <User size={16} className="dropdown-icon" />
                <span>Account Details</span>
              </div>
              <div 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} className="dropdown-icon" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;