import React, { useState } from 'react';
import { X, Plus, Upload, Trash } from 'lucide-react';
import '../styles/ProfileForm.css';
import { createUserProfile } from '../utils/api'; // We'll create this function
import { useNavigate } from 'react-router-dom';

const ProfileForm = ({onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profilePicture: null,
    links: [{ platform: '', url: '' }]
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate=useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, links: updatedLinks });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { platform: '', url: '' }]
    });
  };

  const removeLink = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({ ...formData, links: updatedLinks });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Create a FormData object to handle the file upload
      const profileData = new FormData();
      profileData.append('name', formData.name);
      profileData.append('bio', formData.bio);
      
      if (formData.profilePicture) {
        profileData.append('profilePicture', formData.profilePicture);
      }
      
      // Add links as a JSON string
      profileData.append('links', JSON.stringify(formData.links));
      
      // Send data to the backend
       // eslint-disable-next-line 
      const response = await createUserProfile(profileData);

      
      navigate('/dashboard');
           

    } catch (err) {
      setError(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-form-container">
      <div className="form-header">
        <h2>Create Your Profile</h2>
        <button className="close-button" onClick={onCancel}>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <div className="profile-picture-upload">
            <div className="profile-picture-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile Preview" />
              ) : (
                <div className="placeholder">
                  <Upload size={32} />
                  <span>Upload Photo</span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <label htmlFor="profilePicture" className="upload-button">
              Choose Image
            </label>
            {previewUrl && (
              <button 
                type="button" 
                className="remove-image-button"
                onClick={() => {
                  setPreviewUrl(null);
                  setFormData({ ...formData, profilePicture: null });
                }}
              >
                <Trash size={16} />
                Remove
              </button>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
              rows={4}
              required
            ></textarea>
          </div>
        </div>

        <div className="form-section">
          <div className="form-group links-section">
            <label>Social Links</label>
            <p className="links-description">Add your social media or website links</p>
            
            {formData.links.map((link, index) => (
              <div className="link-input-group" key={index}>
                <div className="link-inputs">
                  <select
                    value={link.platform}
                    onChange={(e) => handleLinkChange(index, 'platform', e.target.value)}
                    required
                  >
                    <option value="">Select Platform</option>
                    <option value="website">Website</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="github">GitHub</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="url"
                    placeholder="https://"
                    value={link.url}
                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                    required
                  />
                </div>
                {formData.links.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-link-button"
                    onClick={() => removeLink(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            
            <button 
              type="button" 
              className="add-link-button"
              onClick={addLink}
            >
              <Plus size={16} />
              Add Another Link
            </button>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;