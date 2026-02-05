import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const CitizenHomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar/>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 mt-16 to-blue-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <h1 className="text-4xl font-bold">
            Welcome, <span className="text-orange-400">Citizen</span> 
          </h1>
          <p className="mt-3 text-lg opacity-90 max-w-lg">
            Report issues, track your complaints, and contribute to transparent
            civic governance with JanSetu.
          </p>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">

        {/* Report Issue */}
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition border-t-4 border-orange-500 text-center">
          <h2 className="text-xl font-bold text-blue-900">Report New Issue</h2>
          <p className="text-gray-600 mt-2">
            Submit civic problems with text, image or location.
          </p>
          <button className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            Report Now
          </button>
        </div>

        {/* Track Complaints */}
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition border-t-4 border-blue-700 text-center">
          <h2 className="text-xl font-bold text-blue-900">Track Status</h2>
          <p className="text-gray-600 mt-2">
            Check live updates on your submitted complaints.
          </p>
          <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            View Status
          </button>
        </div>

        {/* My Reports */}
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition border-t-4 border-orange-500 text-center">
          <h2 className="text-xl font-bold text-blue-900">My Issues</h2>
          <p className="text-gray-600 mt-2">
            View history of issues you reported previously.
          </p>
          <button className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            View My Issues
          </button>
        </div>

      </section>

      {/* RECENT ISSUES SECTION */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Recent Issues Around You</h2>

        <div className="bg-white rounded-xl shadow p-6">

          {/* Issue Row */}
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <h3 className="font-semibold text-blue-900">Pothole near Koramangala</h3>
              <p className="text-gray-500 text-sm">Reported 2 hours ago</p>
            </div>
            <span className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm">
              Pending
            </span>
          </div>

          {/* Issue Row */}
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <h3 className="font-semibold text-blue-900">Overflowing garbage bin</h3>
              <p className="text-gray-500 text-sm">Reported yesterday</p>
            </div>
            <span className="bg-blue-700 text-white px-3 py-1 rounded-md text-sm">
              In Progress
            </span>
          </div>

          {/* Issue Row */}
          <div className="flex justify-between items-center py-3">
            <div>
              <h3 className="font-semibold text-blue-900">Streetlight not working</h3>
              <p className="text-gray-500 text-sm">Resolved 3 days ago</p>
            </div>
            <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
              Resolved
            </span>
          </div>

        </div>
      </section>

      <Footer/>
    </div>
  );
};

export default CitizenHomePage;
