import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import useDashboardData from "@/hooks/useGetDashboardData";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { stats, aiSummary, recentIssues, emailComplaints, loading, error } =
    useDashboardData();

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  console.log("Dashboard Data:", {
    stats,
    aiSummary,
    recentIssues,
    emailComplaints,
  });

  const openDetails = (type) => {
    let filtered = [];

    if (type === "duplicate") {
      filtered = recentIssues.filter(
        (i) => i.clusterId && i.clusterId !== null,
      );
      setModalTitle("Duplicate Reports");
    }

    if (type === "negative") {
      filtered = recentIssues.filter(
        (i) => i.sentiment?.label?.toUpperCase() === "NEGATIVE",
      );
      setModalTitle("Negative Sentiment Complaints");
    }

    if (type === "high") {
      filtered = recentIssues.filter((i) => i.priorityLevel === "High");
      setModalTitle("High Priority Complaints");
    }

    setModalData(filtered);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-14 px-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Smart City AI Dashboard</h1>
          <p className="mt-3 text-lg opacity-90">
            AI-powered complaint analysis & prioritization system
          </p>
        </div>
      </section>

      {/* 🚨 High Priority Banner */}
      {stats?.highPriority > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">🚨 High Priority Issues</h3>
              <p>{stats.highPriority} urgent complaints require attention</p>
            </div>
            <button
              onClick={() => navigate("/issuemanagement?filter=high")}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold"
            >
              View Now
            </button>
          </div>
        </section>
      )}

      {/* 📊 Stats */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Complaints"
          value={stats?.totalComplaints || 0}
        />
        <StatCard title="Active Clusters" value={stats?.activeClusters || 0} />
        <StatCard title="High Priority" value={stats?.highPriority || 0} />
        <StatCard
          title="Avg Resolution Time"
          value={`${stats?.avgResolutionTime || 0} Days`}
        />
      </section>

      {/* 🧠 AI Insights */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">AI Complaint Intelligence</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <InsightCard
            title="Duplicate Reports"
            value={aiSummary?.duplicateReports || 0}
            onClick={() => openDetails("duplicate")}
          />

          <InsightCard
            title="Negative Sentiment"
            value={`${aiSummary?.negativePercentage || 0}%`}
            onClick={() => openDetails("negative")}
          />

          <InsightCard
            title="High Priority"
            value={stats?.highPriority || 0}
            onClick={() => openDetails("high")}
          />
        </div>
      </section>

      {/* 📑 Recent Complaints */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Recent Complaints</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Cluster</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentIssues?.map((issue) => (
                <tr key={issue._id} className="border-t">
                  <td className="p-4">{issue.title}</td>
                  <td className="p-4">{issue.category}</td>
                  <td className="p-4 font-semibold">{issue.priorityLevel}</td>
                  <td className="p-4">{issue.clusterId || "-"}</td>
                  <td className="p-4">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 📧 Email Complaints */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-4">Email Complaints</h2>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 font-semibold">
              <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Sentiment</th>
                <th className="p-4">Score</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {emailComplaints?.map((mail) => (
                <tr key={mail._id} className="border-t">
                  <td className="p-4">{mail.subject}</td>
                  <td className="p-4">{mail.aiPriorityLevel || "-"}</td>
                  <td className="p-4">{mail.aiSentiment?.label || "-"}</td>
                  <td className="p-4">{mail.aiPriorityScore || "-"}</td>
                  <td className="p-4">
                    {new Date(mail.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 rounded-xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">{modalTitle}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {modalData.map((item) => (
              <div key={item._id} className="border-b py-2">
                {item.title}
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;

/* ================= INLINE COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
    <h3 className="text-3xl font-bold">{value}</h3>
    <p className="text-gray-600 text-sm mt-1">{title}</p>
  </div>
);

const InsightCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
    <p className="text-xs text-blue-500 mt-2 underline">
      Click to view details
    </p>
  </div>
);
