import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/apiClient";

const IssueManagement = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All"); // ✅ NEW

  const [viewModal, setViewModal] = useState(null);

  /* ================= FETCH ISSUES ================= */
  const fetchIssues = async () => {
    try {
      setLoading(true);

      const res = await apiClient.get("/issues/getIssueByFilter", {
        params: {
          category: categoryFilter,
          status: statusFilter,
          priority: priorityFilter, // ✅ NEW
          search: search,
        },
      });

      setIssues(res.data.issues);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [categoryFilter, statusFilter, priorityFilter, search]);

  const getPriorityColor = (priority) => {
    if (priority === "High") return "bg-red-100 text-red-600";
    if (priority === "Medium") return "bg-yellow-100 text-yellow-700";
    if (priority === "Low") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading Issues...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-5 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Issue Management</h1>
        </div>
      </section>

      {/* FILTERS */}
      <section className="max-w-6xl mx-auto px-6 py-6 bg-white rounded-xl shadow mt-8">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            placeholder="Search issue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option>All</option>
            <option>Reported</option>
            <option>InProgress</option>
            <option>Resolved</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option>All</option>
            <option>Road</option>
            <option>Cleanliness</option>
            <option>Electricity</option>
            <option>Water</option>
          </select>

          {/* ✅ PRIORITY FILTER */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </section>

      {/* TABLE */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Citizen</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th> {/* ✅ NEW */}
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-6">
                    No issues found
                  </td>
                </tr>
              ) : (
                issues.map((issue) => (
                  <tr key={issue._id} className="border-t">
                    <td className="p-4">{issue.title}</td>
                    <td className="p-4">{issue.createdBy?.username}</td>
                    <td className="p-4">{issue.category}</td>

                    {/* ✅ PRIORITY BADGE */}
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getPriorityColor(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </span>
                    </td>

                    <td className="p-4">{issue.status}</td>

                    <td className="p-4">
                      <button
                        onClick={() => setViewModal(issue)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* VIEW MODAL */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{viewModal.title}</h2>
              <button
                onClick={() => setViewModal(null)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p><strong>Category:</strong> {viewModal.category}</p>
              <p><strong>Priority:</strong> {viewModal.priority}</p>
              <p><strong>Status:</strong> {viewModal.status}</p>
              <p><strong>Description:</strong> {viewModal.description}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default IssueManagement;