import React from 'react';
import Info from './Info';
import ProfileForm from './ProfileForm';
import ProfileDisplay from './ProfileDisplay';
import '../styles/StagingArea.css';

const StagingArea = ({ 
  activeSection, 
  isFormOpen,
  profileCreated, 
  profileData, 
  onCreateProfile,
  onViewProfile,
  onProfileCreate, 
  onFormCancel
}) => {
  
  const renderContent = () => {
    if (activeSection === 'profile') {
      return <ProfileDisplay profileData={profileData} />;
    }
    
 
    if (activeSection === 'dashboard') {
      // Show form when form is open
      if (isFormOpen) {
        return <ProfileForm onSubmit={onProfileCreate} onCancel={onFormCancel} />;
      } 
      // Otherwise show info component
      return (
        <Info 
          onCreateProfile={onCreateProfile} 
          profileCreated={profileCreated}
          onViewProfile={onViewProfile}
        />
      );
    }
    
    // Fallback
    return <div>Invalid section</div>;
  };

  return (
    <div className="staging-area">
      {renderContent()}
    </div>
  );
};

export default StagingArea;