import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchSort from "./SearchSort";
import StagingArea from "./StagingArea";
import "../styles/Dashboard.css";
import { checkProfile } from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");


  const [activeSection, setActiveSection] = useState("dashboard");
  const [profileCreated, setProfileCreated] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    profilePicture: null,
    links: [],
  });


  useEffect(() => {
    const savedProfileData = localStorage.getItem("userProfile");

    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        setProfileData(parsedData);
        setProfileCreated(true);
      } catch (error) {
        console.error("Error parsing profile data from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;

    if (path === "/profile") {
      if (profileCreated) {
        setActiveSection("profile");
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else if (path === "/dashboard") {
      setActiveSection("dashboard");
    }
  }, [location.pathname, profileCreated, navigate]);



  useEffect(() => {
    const fetchProfileStatus = async () => {
      const exists = await checkProfile();
      console.log(exists);
      setProfileCreated(exists);
    };

    fetchProfileStatus();
  }, []);

  

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Update URL to match the section
    navigate(`/${section}`);
  };

  const handleCreateProfileClick = () => {
    setIsFormOpen(true);
  };

  const handleViewProfileClick = () => {
    if (profileCreated) {
      handleSectionChange("profile");
    }
  };

  const handleFormSubmit = (formData) => {
    const storageData = { ...formData };
    if (formData.profilePicture instanceof File) {
      storageData.profilePicture = null;
    }

    // Update state with the full data including File objects
    setProfileData(formData);
    setProfileCreated(true);
    setIsFormOpen(false);

    // Save to localStorage (without File objects)
    try {
      localStorage.setItem("userProfile", JSON.stringify(storageData));
    } catch (error) {
      console.error("Error saving profile data to localStorage:", error);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar-container">
        <Sidebar
          onSectionChange={handleSectionChange}
          activeSection={activeSection}
          profileCreated={profileCreated}
        />
      </div>
      <div className="content-container">
        <div className="search-container">
          <SearchSort onSearch={handleSearch} />
        </div>
        <div className="staging-container">
          <StagingArea
            activeSection={activeSection}
            isFormOpen={isFormOpen}
            profileCreated={profileCreated}
            profileData={profileData}
            onCreateProfile={handleCreateProfileClick}
            onViewProfile={handleViewProfileClick}
            onProfileCreate={handleFormSubmit}
            onFormCancel={handleFormCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
