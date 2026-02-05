import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar/>
      {/* Hero Header */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white mt-16 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome, <span className="text-orange-400">Admin</span> 
          </h1>

          <p className="mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Manage citizen-reported issues, monitor departments, and maintain 
            transparent governance with the JanSetu admin system.
          </p>
        </div>
      </section>

      {/* Main Actions */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        {/* Manage Issues */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-8 border-t-4 border-blue-700">
          <h2 className="text-2xl font-bold text-blue-900">Manage Issues</h2>
          <p className="text-gray-600 mt-2">
            View, update, and verify reported issues from citizens.
          </p>
          <button className="mt-5 bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-800 transition">
            Go to Issues
          </button>
        </div>

        {/* Department Panel */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-8 border-t-4 border-orange-500">
          <h2 className="text-2xl font-bold text-orange-600">Departments</h2>
          <p className="text-gray-600 mt-2">
            Assign, manage and track issue resolution across departments.
          </p>
          <button className="mt-5 bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">
            Open Departments
          </button>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-8 border-t-4 border-blue-700">
          <h2 className="text-2xl font-bold text-blue-700">Analytics</h2>
          <p className="text-gray-600 mt-2">
            View smart governance insights, heatmaps and performance metrics.
          </p>
          <button className="mt-5 bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            View Analytics
          </button>
        </div>

      </section>

      {/* Footer Note */}
      
      <Footer/>
    </div>
  );
};

export default AdminHome;
