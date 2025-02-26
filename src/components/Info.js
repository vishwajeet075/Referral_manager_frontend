import React from 'react';
import { Link, Users, Gift, Award, ChevronRight } from 'lucide-react';
import { Rocket, Eye } from 'lucide-react';
import '../styles/Info.css';

const Info = ({ onCreateProfile, profileCreated, onViewProfile }) => {
  return (
    <div className="info-container">
      <div className="info-header">
        <h1>Welcome to Referral Manager</h1>
        <div className="info-subtitle">Create your profile and start earning rewards through referrals</div>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <div className="info-card-icon">
            <Users size={48} color="#4F46E5" />
          </div>
          <h3>Build Your Network</h3>
          <p>Create a personalized profile page to showcase your brand and connect with potential referrals.</p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">
            <Link size={48} color="#4F46E5" />
          </div>
          <h3>Share Your Link</h3>
          <p>Generate a unique referral link and share it across your social networks to maximize your reach.</p>
        </div>

        <div className="info-card">
          <div className="info-card-icon">
            <Gift size={48} color="#4F46E5" />
          </div>
          <h3>Earn Rewards</h3>
          <p>Collect points every time someone signs up using your referral link. Points can be redeemed for exciting rewards.</p>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <h2>500+</h2>
          <p>Active Users</p>
        </div>
        <div className="stat-item">
          <h2>10,000+</h2>
          <p>Successful Referrals</p>
        </div>
        <div className="stat-item">
          <h2>$50,000+</h2>
          <p>Rewards Earned</p>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Profile</h3>
              <p>Set up your personalized profile with your information and links</p>
            </div>
          </div>
          <ChevronRight className="step-arrow" size={24} />
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Share Your Link</h3>
              <p>Distribute your unique referral link to your network</p>
            </div>
          </div>
          <ChevronRight className="step-arrow" size={24} />
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Track Referrals</h3>
              <p>Monitor your referrals and points in real-time</p>
            </div>
          </div>
          <ChevronRight className="step-arrow" size={24} />
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Earn Rewards</h3>
              <p>Redeem your points for exclusive rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Show different buttons based on profile status */}
      {!profileCreated ? (
        <button 
          className="create-profile-button" 
          onClick={onCreateProfile}
        >
          Create Profile
          <Rocket size={20} />
        </button>
      ) : (
        <button 
          className="view-profile-button" 
          onClick={onViewProfile}
        >
          View Profile
          <Eye size={20} />
        </button>
      )}

      {profileCreated && (
        <div className="profile-created-message">
          <Award size={20} color="#4F46E5" />
          <span>Your profile has been created! You can view it from the Profile section in the sidebar or by clicking the button above.</span>
        </div>
      )}
    </div>
  );
};

export default Info;