import React, { useEffect, useState } from "react";
import logo from "@/assets/JanSetuLogo.png";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/janSetu/auth/user-profile",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setUserProfile(data.profile);
      if (data.profile.userId) {
        setUsername(data.profile.userId.username);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/citizendashboard")}>
          <img 
            src={logo} 
            alt="JanSetuLogo" 
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold text-blue-900">
            <span className="text-blue-900">Jan</span>
            <span className="text-orange-500">Setu</span>
          </h1>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => navigate("/citizendashboard")}
            className="text-blue-900 font-medium hover:text-orange-500 duration-200"
          >
            Dashboard
          </button>
          <button 
            onClick={() => navigate("/reportissue")}
            className="text-blue-900 font-medium hover:text-orange-500 duration-200"
          >
            Report Issue
          </button>
          <button 
            onClick={() => navigate("/rewardsleaderboard")}
            className="text-blue-900 font-medium hover:text-orange-500 duration-200"
          >
            Leaderboard
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Reward Points */}
          <div className="hidden md:flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-lg border border-orange-200">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-xs text-gray-600">Points</p>
              <p className="text-lg font-bold text-orange-600">
                {isLoading ? "..." : userProfile?.rewardPoints || 0}
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-blue-900">
                {isLoading ? "Loading..." : username || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {isLoading ? "" : userProfile?.issuesReported || 0} Issues
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
