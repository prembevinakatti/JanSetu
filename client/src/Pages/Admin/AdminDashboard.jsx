import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import useDashboardData from "@/hooks/useGetDashboardData";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { stats, aiSummary, recentIssues, loading, error } = useDashboardData();

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);

  // Demo locations for hotspots (Bangalore areas)
  const demoLocations = {
    Whitefield: [12.9698, 77.75],
    Koramangala: [12.9352, 77.6245],
    Indiranagar: [12.9784, 77.6408],
    Jayanagar: [12.9299, 77.5824],
    Rajajinagar: [12.9882, 77.5549],
  };

  // Custom red hotspot marker icon
  const hotspotIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  /* ================= CATEGORY CHART DATA ================= */

  const categoryData = useMemo(() => {
    const map = {};

    recentIssues?.forEach((issue) => {
      map[issue.category] = (map[issue.category] || 0) + 1;
    });

    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key],
    }));
  }, [recentIssues]);

  /* ================= AREA HOTSPOTS ================= */

  const hotspotData = useMemo(() => {
    const map = {};

    recentIssues?.forEach((issue) => {
      const area = issue.location || "Unknown";
      map[area] = (map[area] || 0) + 1;
    });

    return Object.keys(map)
      .map((area) => ({
        area,
        complaints: map[area],
      }))
      .sort((a, b) => b.complaints - a.complaints)
      .slice(0, 5);
  }, [recentIssues]);

  /* ================= AI CITY RISK SCORE ================= */

  const cityRisk = useMemo(() => {
    const total = stats?.totalComplaints || 0;
    const high = stats?.highPriority || 0;

    if (!total) return 0;

    const risk = Math.round((high / total) * 100);

    return risk;
  }, [stats]);

  /* ================= MODAL HANDLER ================= */

  const openDetails = (type) => {
    let filtered = [];

    if (type === "duplicate") {
      const grouped = {};

      recentIssues.forEach((issue) => {
        if (issue.clusterId) {
          if (!grouped[issue.clusterId]) grouped[issue.clusterId] = [];
          grouped[issue.clusterId].push(issue);
        }
      });

      const formatted = Object.entries(grouped).map(([clusterId, issues]) => ({
        clusterId,
        count: issues.length,
        mainTitle: issues[0].title,
        priority: issues[0].priorityLevel,
        issues,
      }));

      setModalTitle("Duplicate Reports");
      setModalData(formatted);
      setShowModal(true);
      return;
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

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
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

      {/* HIGH PRIORITY BANNER */}

      {stats?.highPriority > 0 && (
        <section className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-red-600 text-white p-4 rounded-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">🚨 High Priority Issues</h3>
              <p>{stats.highPriority} urgent complaints need attention</p>
            </div>

            <button
              onClick={() => navigate("/issuemanagement?filter=high")}
              className="bg-white text-red-600 px-4 py-2 rounded-lg"
            >
              View Now
            </button>
          </div>
        </section>
      )}

      {/* STATS */}

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

      {/* AI INSIGHTS */}

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

      <div
        onClick={() => navigate("/upload-complaints")}
        className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg"
      >
        <h3 className="text-lg font-bold">Bulk Complaint Upload</h3>
        <p className="text-sm text-gray-500 mt-2">
          Upload a file containing multiple complaints for AI analysis
        </p>
      </div>

      {/* CITY RISK INDEX */}

      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold">AI City Risk Index</h2>
          <p className="text-4xl font-bold mt-2">{cityRisk}%</p>
          <p className="text-sm opacity-80">
            Based on current high priority complaint patterns
          </p>
        </div>
      </section>

      {/* MAP */}

      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Geographic Hotspots</h2>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="h-[400px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={[12.9716, 77.5946]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {Object.entries(demoLocations).map(([area, [lat, lng]]) => {
                const complaintCount =
                  hotspotData.find((h) => h.area === area)?.complaints ||
                  Math.floor(Math.random() * 50) + 5;
                return (
                  <Marker key={area} position={[lat, lng]} icon={hotspotIcon}>
                    <LeafletTooltip direction="top" offset={[0, -10]} permanent>
                      <div className="text-center text-xs font-bold text-red-600">
                        🔥 HOTSPOT
                        <br />
                        {area}
                      </div>
                    </LeafletTooltip>
                    <Popup>
                      <div className="text-sm">
                        <div className="inline-block bg-red-600 text-white px-2 py-1 rounded text-xs font-bold mb-2">
                          🔥 HOTSPOT
                        </div>
                        <h4 className="font-bold text-red-600 mt-2">{area}</h4>
                        <p className="text-gray-700 mt-1">
                          Complaints:{" "}
                          <span className="font-semibold text-red-600">
                            {complaintCount}
                          </span>
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                          High complaint density area
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}

      <section className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">Complaint Categories</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" outerRadius={100} label>
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">Top Complaint Areas</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hotspotData}>
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="complaints" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* RECENT COMPLAINTS */}

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

      <Footer />
    </div>
  );
};

export default AdminDashboard;

/* ================= COMPONENTS ================= */

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
