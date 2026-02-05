import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Analytics = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-4 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">Analytics & Insights</h1>
          <p className="mt-3 text-lg opacity-90">
            Visualize issue data, performance metrics, and city insights.
          </p>
        </div>
      </section>

      {/* METRICS */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">
        {/* Total Issues */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-700">
          <h3 className="text-3xl font-bold text-blue-900">128</h3>
          <p className="text-gray-600 text-sm mt-1">Total Issues</p>
        </div>

        {/* Resolved */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-green-600">
          <h3 className="text-3xl font-bold text-green-600">48</h3>
          <p className="text-gray-600 text-sm mt-1">Resolved Issues</p>
        </div>

        {/* In Progress */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-blue-500">
          <h3 className="text-3xl font-bold text-blue-900">56</h3>
          <p className="text-gray-600 text-sm mt-1">In Progress</p>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-xl shadow border-t-4 border-orange-500">
          <h3 className="text-3xl font-bold text-orange-500">24</h3>
          <p className="text-gray-600 text-sm mt-1">Pending</p>
        </div>
      </section>

      {/* GRAPH SECTIONS */}
      <section className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-2 gap-8">

        {/* ISSUE DISTRIBUTION */}
        <div className="bg-white p-8 rounded-xl shadow border-l-4 border-blue-700">
          <h2 className="text-xl font-bold text-blue-900">Issue Category Distribution</h2>
          <p className="text-gray-600 text-sm mt-1">Visual breakdown of issue types.</p>

          {/* GRAPH PLACEHOLDER */}
          <div className="mt-6 h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
            Pie Chart Placeholder
          </div>
        </div>

        {/* MONTHLY TREND */}
        <div className="bg-white p-8 rounded-xl shadow border-l-4 border-orange-500">
          <h2 className="text-xl font-bold text-blue-900">Monthly Issue Trends</h2>
          <p className="text-gray-600 text-sm mt-1">Track reported issues per month.</p>

          {/* GRAPH PLACEHOLDER */}
          <div className="mt-6 h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
            Line Chart Placeholder
          </div>
        </div>

      </section>

      {/* DEPARTMENT PERFORMANCE */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Department Performance</h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-600">
            <h3 className="text-lg font-bold text-blue-900">Road Department</h3>
            <p className="text-gray-600 mt-1 text-sm">Resolution Rate: 78%</p>
            <div className="h-2 bg-gray-200 rounded mt-2">
              <div className="h-full bg-green-600 rounded w-[78%]"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
            <h3 className="text-lg font-bold text-blue-900">Cleanliness Dept.</h3>
            <p className="text-gray-600 mt-1 text-sm">Resolution Rate: 62%</p>
            <div className="h-2 bg-gray-200 rounded mt-2">
              <div className="h-full bg-orange-500 rounded w-[62%]"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-blue-900">Electricity Dept.</h3>
            <p className="text-gray-600 mt-1 text-sm">Resolution Rate: 41%</p>
            <div className="h-2 bg-gray-200 rounded mt-2">
              <div className="h-full bg-red-500 rounded w-[41%]"></div>
            </div>
          </div>

        </div>
      </section>

      {/* HEATMAP / AREA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Top Issue-Prone Areas</h2>

        <div className="bg-white p-8 rounded-xl shadow border-l-4 border-blue-400">
          <p className="text-gray-600 text-sm">AI-generated hotspots based on issue density.</p>

          <ul className="mt-4 space-y-2 text-blue-900 font-medium">
            <li>• BTM Layout – High Garbage Complaints</li>
            <li>• HSR Layout – Frequent Streetlight Issues</li>
            <li>• Koramangala – High Road Damage Alerts</li>
            <li>• JP Nagar – Moderate Water Leakage Cases</li>
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Analytics;
