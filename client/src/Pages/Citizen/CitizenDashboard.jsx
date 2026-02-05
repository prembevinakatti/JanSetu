import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CitizenDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-14 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">Citizen Dashboard</h1>
          <p className="mt-3 text-lg opacity-90">
            Manage your reports, track issues, and stay updated.
          </p>
        </div>
      </section>

      {/* STATS CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">

        {/* Card 1 */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-700">
          <h3 className="text-xl font-bold text-blue-900">12</h3>
          <p className="text-gray-600 text-sm mt-1">Issues Reported</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-orange-500">
          <h3 className="text-xl font-bold text-blue-900">4</h3>
          <p className="text-gray-600 text-sm mt-1">In Progress</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-green-600">
          <h3 className="text-xl font-bold text-blue-900">7</h3>
          <p className="text-gray-600 text-sm mt-1">Resolved</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-400">
          <h3 className="text-xl font-bold text-blue-900">20</h3>
          <p className="text-gray-600 text-sm mt-1">Upvotes Given</p>
        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* Report Issue */}
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition border-l-4 border-orange-500">
          <h2 className="text-xl font-bold text-blue-900">Report New Issue</h2>
          <p className="text-gray-600 text-sm mt-2">
            Submit civic issues instantly with images & location.
          </p>
          <button className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            Report Issue
          </button>
        </div>

        {/* Track Issue */}
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition border-l-4 border-blue-700">
          <h2 className="text-xl font-bold text-blue-900">Track Your Issues</h2>
          <p className="text-gray-600 text-sm mt-2">
            Check live status updates for your complaints.
          </p>
          <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            Track Issues
          </button>
        </div>

        {/* Schemes */}
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-xl transition border-l-4 border-blue-400">
          <h2 className="text-xl font-bold text-blue-900">Govt Schemes</h2>
          <p className="text-gray-600 text-sm mt-2">
            Discover schemes you're eligible for.
          </p>
          <button className="mt-5 bg-blue-400 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition">
            View Schemes
          </button>
        </div>

      </section>

      {/* RECENT ISSUES TABLE */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Recent Issues Reported</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-blue-900 font-semibold">
              <tr>
                <th className="p-4">Issue Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">

              <tr className="border-t">
                <td className="p-4">Pothole near main road</td>
                <td className="p-4">Road</td>
                <td className="p-4 text-blue-700 font-semibold">In Progress</td>
                <td className="p-4">03 Jan 2025</td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Garbage not collected</td>
                <td className="p-4">Cleanliness</td>
                <td className="p-4 text-green-600 font-semibold">Resolved</td>
                <td className="p-4">01 Jan 2025</td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Streetlight not working</td>
                <td className="p-4">Electricity</td>
                <td className="p-4 text-orange-500 font-semibold">Pending</td>
                <td className="p-4">29 Dec 2024</td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CitizenDashboard;
