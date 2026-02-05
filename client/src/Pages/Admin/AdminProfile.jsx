import Footer from "@/components/Footer";
import React from "react";

const AdminProfile = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <div className="flex-1 flex items-center justify-center px-4 py-10">

        {/* TWO-COLUMN COMPACT CARD */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full grid md:grid-cols-2 overflow-hidden border">

          {/* LEFT SIDE CONTENT */}
          <div className="bg-blue-900 text-white p-10 flex flex-col justify-center">
            <h1 className="text-3xl font-bold">
              Admin <span className="text-orange-400">Profile</span>
            </h1>

            <p className="mt-3 text-sm opacity-90 max-w-sm">
              View and manage your administrator details, maintain security, 
              and update profile settings.
            </p>

            <p className="mt-5 text-xs opacity-80 border-l-4 border-orange-400 pl-3">
              Admin Access • Secure Credentials • Profile Control
            </p>
          </div>

          {/* RIGHT SIDE PROFILE INFO */}
          <div className="p-10 flex items-center justify-center">
            <div className="w-full max-w-sm">

              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <div className="h-28 w-28 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 text-4xl font-bold shadow">
                  A
                </div>

                <h2 className="mt-4 text-2xl font-bold text-blue-900">Admin Name</h2>
                <p className="text-gray-600 text-sm">System Administrator</p>
              </div>

              {/* Profile Fields */}
              <div className="mt-8 space-y-4">

                <div>
                  <p className="text-gray-500 text-xs">FULL NAME</p>
                  <p className="font-semibold text-blue-900">Admin Name</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">EMAIL</p>
                  <p className="font-semibold text-blue-900">admin@jansetu.gov</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">ROLE</p>
                  <p className="font-semibold text-blue-900">Administrator</p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs">PHONE</p>
                  <p className="font-semibold text-blue-900">+91 98765 43210</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-10 flex gap-4 justify-center">
                <button className="px-6 py-2 bg-orange-400 text-white rounded-lg font-medium hover:bg-blue-800 transition">
                  Edit Profile
                </button>

                
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminProfile;
