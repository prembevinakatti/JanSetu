import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // ✅ NEW STATE FOR AI DETAILS MODAL
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  // ✅ Dummy AI Data (Replace later with real backend data)
  const aiData = [
    {
      title: "Pothole near bus stand",
      category: "Road",
      priority: "High",
      cluster: "CL-004",
      sentiment: "Negative",
    },
    {
      title: "Garbage overflow near market",
      category: "Cleanliness",
      priority: "Medium",
      cluster: "CL-002",
      sentiment: "Negative",
    },
  ];

  const openDetails = (type) => {
    let filtered = [];

    if (type === "duplicate") {
      filtered = aiData.filter((i) => i.cluster);
      setModalTitle("Duplicate Reports Details");
    }

    if (type === "negative") {
      filtered = aiData.filter((i) => i.sentiment === "Negative");
      setModalTitle("Negative Sentiment Complaints");
    }

    if (type === "escalated") {
      filtered = aiData.filter((i) => i.priority === "High");
      setModalTitle("Escalated High Priority Complaints");
    }

    setModalData(filtered);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-14 px-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Smart City AI Dashboard</h1>
          <p className="mt-3 text-lg opacity-90">
            AI-powered complaint analysis, prioritization & city intelligence system.
          </p>
        </div>
      </section>

      {/* 🚨 EMERGENCY ALERT BANNER */}
      <section className="max-w-7xl mx-auto px-6 mt-8">
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg">🚨 Emergency Issues Detected</h3>
            <p className="text-sm">6 high-risk complaints require immediate action.</p>
          </div>
          <button
            onClick={() => navigate("/issuemanagement?filter=emergency")}
            className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            View Now
          </button>
        </div>
      </section>

      {/* 📊 CORE STATISTICS */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">
        <StatCard title="Total Complaints" value="128" color="blue" />
        <StatCard title="Active Clusters" value="18" color="purple" />
        <StatCard title="High Priority" value="9" color="red" />
        <StatCard title="Avg Resolution Time" value="2.4 Days" color="green" />
      </section>

      {/* 🧠 AI ANALYTICS */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          AI Complaint Intelligence
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <InsightCard
            title="Duplicate Reports"
            value="42"
            desc="Grouped using semantic clustering"
            color="purple"
            onClick={() => openDetails("duplicate")}
          />

          <InsightCard
            title="Negative Sentiment"
            value="31%"
            desc="Citizen frustration detected"
            color="orange"
            onClick={() => openDetails("negative")}
          />

          <InsightCard
            title="Escalated by AI"
            value="12"
            desc="Priority boosted due to cluster size"
            color="red"
            onClick={() => openDetails("escalated")}
          />
        </div>
      </section>

      {/* 📍 HOTSPOT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          Geographic Hotspots
        </h2>

        <div className="bg-white h-64 rounded-xl shadow flex items-center justify-center text-gray-500">
          📍 Map Visualization (Cluster Heatmap Integration Here)
        </div>
      </section>

      {/* 🏢 DEPARTMENT PERFORMANCE */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Department Performance Analytics
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <DepartmentCard name="Road & Transportation" rate="78%" status="Good" color="blue" />
          <DepartmentCard name="Garbage & Cleanliness" rate="62%" status="Average" color="orange" />
          <DepartmentCard name="Electricity" rate="41%" status="Poor" color="red" />
        </div>
      </section>

      {/* 📑 RECENT COMPLAINTS */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">
          Recent Complaints
        </h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-blue-900 font-semibold">
              <tr>
                <th className="p-4">Issue</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Cluster</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-t">
                <td className="p-4">Pothole near bus stand</td>
                <td className="p-4">Road</td>
                <td className="p-4 text-red-600 font-semibold">High</td>
                <td className="p-4">CL-004</td>
                <td className="p-4 text-blue-700 font-semibold">In Progress</td>
                <td className="p-4">15 Feb 2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ✅ MODAL FOR AI DETAILS */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 max-h-[80vh] overflow-y-auto rounded-xl shadow-lg p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 font-semibold">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Cluster</th>
                </tr>
              </thead>

              <tbody>
                {modalData.map((issue, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{issue.title}</td>
                    <td className="p-3">{issue.category}</td>
                    <td className="p-3">{issue.priority}</td>
                    <td className="p-3">{issue.cluster}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;


/* ---------------- COMPONENTS ---------------- */

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow border-t-4 border-${color}-600`}>
    <h3 className="text-3xl font-bold text-blue-900">{value}</h3>
    <p className="text-gray-600 text-sm mt-1">{title}</p>
  </div>
);

const InsightCard = ({ title, value, desc, color, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white p-6 rounded-xl shadow border-l-4 border-${color}-600`}
  >
    <h3 className="text-lg font-bold text-blue-900">{title}</h3>
    <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
    <p className="text-sm text-gray-500 mt-1">{desc}</p>
    <p className="text-xs text-blue-500 mt-2 underline">
      Click to view details
    </p>
  </div>
);

const DepartmentCard = ({ name, rate, status, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow border-l-4 border-${color}-600`}>
    <h3 className="text-lg font-bold text-blue-900">{name}</h3>
    <p className="text-gray-600 mt-1 text-sm">Resolution Rate: {rate}</p>
    <p className={`text-${color}-600 text-sm mt-1 font-semibold`}>
      Status: {status}
    </p>
  </div>
);
