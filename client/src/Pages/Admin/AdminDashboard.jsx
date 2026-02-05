import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-14 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-3 text-lg opacity-90">
            Manage civic issues, monitor departments & ensure transparency.
          </p>
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-700">
          <h3 className="text-3xl font-bold text-blue-900">128</h3>
          <p className="text-gray-600 text-sm mt-1">Total Issues</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-orange-500">
          <h3 className="text-3xl font-bold text-orange-600">24</h3>
          <p className="text-gray-600 text-sm mt-1">Pending</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-500">
          <h3 className="text-3xl font-bold text-blue-900">56</h3>
          <p className="text-gray-600 text-sm mt-1">In Progress</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-700">
          <h3 className="text-3xl font-bold text-blue-700">48</h3>
          <p className="text-gray-600 text-sm mt-1">Resolved</p>
        </div>

      </section>

      {/* QUICK ACTIONS */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        <div className="bg-white p-8 rounded-xl shadow border-l-4 border-blue-700 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-blue-900">View All Issues</h2>
          <p className="text-gray-600 text-sm mt-2">
            Check and manage all civic complaints.
          </p>
          <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            Open Issues Panel
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow border-l-4 border-orange-500 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-blue-900">Department Overview</h2>
          <p className="text-gray-600 text-sm mt-2">
            Monitor workload & performance across departments.
          </p>
          <button className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
            View Departments
          </button>
        </div>

        <div className="bg-white p-8 rounded-xl shadow border-l-4 border-blue-700 hover:shadow-xl transition">
          <h2 className="text-xl font-bold text-blue-900">Generate Reports</h2>
          <p className="text-gray-600 text-sm mt-2">
            Download analytics and monthly summaries.
          </p>
          <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
            Download Report
          </button>
        </div>

      </section>

      {/* DEPARTMENT PERFORMANCE */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Department Performance</h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-700">
            <h3 className="text-lg font-bold text-blue-900">Road Department</h3>
            <p className="text-gray-600 mt-1 text-sm">Resolution Rate: 78%</p>
            <p className="text-blue-700 text-sm mt-1">Status: Good</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
            <h3 className="text-lg font-bold text-blue-900">Cleanliness Dept.</h3>
            <p className="text-gray-600 mt-1 text-sm">Resolution Rate: 62%</p>
            <p className="text-orange-500 text-sm mt-1">Status: Average</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-blue-900">Electricity Dept.</h3>
            <p className="text-gray-600 mt-1 text-sm">Resolution Rate: 41%</p>
            <p className="text-red-500 text-sm mt-1">Status: Poor</p>
          </div>

        </div>
      </section>

      {/* RECENT ISSUES TABLE */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Recent Issues</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-blue-900 font-semibold">
              <tr>
                <th className="p-4">Issue</th>
                <th className="p-4">Category</th>
                <th className="p-4">Citizen</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-t">
                <td className="p-4">Water leakage near park</td>
                <td className="p-4">Water Supply</td>
                <td className="p-4">Rohit S</td>
                <td className="p-4 text-blue-700 font-semibold">In Progress</td>
                <td className="p-4">04 Jan 2025</td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Garbage not collected</td>
                <td className="p-4">Cleanliness</td>
                <td className="p-4">Ananya M</td>
                <td className="p-4 text-orange-500 font-semibold">Pending</td>
                <td className="p-4">03 Jan 2025</td>
              </tr>

              <tr className="border-t">
                <td className="p-4">Streetlight fault</td>
                <td className="p-4">Electricity</td>
                <td className="p-4">Nikhil P</td>
                <td className="p-4 text-blue-700 font-semibold">Resolved</td>
                <td className="p-4">01 Jan 2025</td>
              </tr>

            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
