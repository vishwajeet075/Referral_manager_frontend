// Base URL for API requests
const API_BASE_URL = 'https://referral-manager-backend.onrender.com'; // Change to your backend URL


// Helper function to get JWT token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
  };




export const verifyToken = async (token) => {
    try {
      const response = await fetch("https://referral-manager-backend.onrender.com/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data.isValid; 
      } else {
        console.error("Token verification failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  };







// Create user profile
export const createUserProfile = async (profileData) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/profile/set_profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
       
      },
      body: profileData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create profile');
    }
    
    return data;
  } catch (error) {
    console.error('Profile creation error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/profile/get_profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    console.log("Data recived in api.js ",data);
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    
    return data;
  } catch (error) {
    console.error('Profile fetch error:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required. Please log in again.');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/profile/set_profile`, {
      method: 'POST', // Your backend uses POST for both create and update
      headers: {
        'Authorization': `Bearer ${token}`
        // Note: Don't set Content-Type when sending FormData
      },
      body: profileData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    
    return data;
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};




export const checkProfile=async ()=>{
    const token=getAuthToken();
    if (!token){
      throw new Error('Authentication required.Pleasse login again');
    }
     
    try {
      const response = await fetch('https://referral-manager-backend.onrender.com/profile/check', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check profile');
      }
      
      return data.exists;
    } catch (error) {
      console.error('Profile check error:', error);
      throw error;
    }
};



export const generateReferralLink = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required. Please login again');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/referral/generate-referral`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate referral link');
    }

    return data;
  } catch (error) {
    console.error('Referral generation error:', error);
    throw error;
  }
};