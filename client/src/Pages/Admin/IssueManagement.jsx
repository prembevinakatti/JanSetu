import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/apiClient";

const IssueManagement = () => {
  const [webIssues, setWebIssues] = useState([]);
  const [emailIssues, setEmailIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);

  const [expandedPriority, setExpandedPriority] = useState(null);

  const togglePriority = (priority) => {
    setExpandedPriority(expandedPriority === priority ? null : priority);
  };

  /* ================= FETCH BOTH ================= */

  const fetchAllComplaints = async () => {
    try {
      setLoading(true);

      const [webRes, emailRes] = await Promise.all([
        apiClient.get("/issues/getIssueByFilter"),
        apiClient.get("/emailComplaints/getAllEmailComplaints"),
      ]);

      setWebIssues(webRes.data.issues);
      setEmailIssues(emailRes.data.emails);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  /* ================= PRIORITY GROUPS ================= */

  const priorityGroups = {
    P1: webIssues.filter((i) => i.priorityLevel === "High"),
    P2: webIssues.filter((i) => i.priorityLevel === "Medium"),
    P3: webIssues.filter((i) => i.priorityLevel === "Low"),
  };

  /* ================= HIGH PRIORITY (WEB + EMAIL) ================= */

  const highPriority = [
    ...webIssues.filter((i) => i.priorityLevel === "High"),
    ...emailIssues.filter((i) => i.aiPriorityLevel === "High"),
  ];

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

      {/* ================= HIGH PRIORITY ================= */}

      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4 text-red-700">
          🔥 High Priority Issues
        </h2>

        {highPriority.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">
            No High Priority Issues
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {highPriority.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-xl shadow border-l-4 border-red-500"
              >
                <h3 className="font-semibold">{item.title || item.subject}</h3>

                <p className="text-sm text-gray-600 mt-2">
                  {item.description || item.body}
                </p>

                <button
                  onClick={() => setViewModal(item)}
                  className="mt-3 px-3 py-1 bg-red-600 text-white rounded text-xs"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= WEB COMPLAINTS ================= */}

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Web Complaints
        </h2>

        <div className="space-y-4">
          {Object.entries(priorityGroups).map(([priority, issues]) => {
            const label =
              priority === "P1" ? "High" : priority === "P2" ? "Medium" : "Low";

            return (
              <div key={priority} className="bg-white rounded-xl shadow">
                {/* HEADER */}
                <div
                  onClick={() => togglePriority(priority)}
                  className="flex justify-between items-center p-4 cursor-pointer border-b"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{priority}</span>

                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        label,
                      )}`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 font-medium">
                      {issues.length} complaints
                    </span>

                    <span className="text-xl">
                      {expandedPriority === priority ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {/* TABLE */}
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    expandedPriority === priority
                      ? "max-h-[600px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-4">Title</th>
                          <th className="p-4">Citizen</th>
                          <th className="p-4">Priority</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {issues.length === 0 ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="text-center p-4 text-gray-500"
                            >
                              No complaints
                            </td>
                          </tr>
                        ) : (
                          issues.map((issue) => (
                            <tr key={issue._id} className="border-t">
                              <td className="p-4">{issue.title}</td>

                              <td className="p-4">
                                {issue.createdBy?.username}
                              </td>

                              <td className="p-4">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                                    issue.priorityLevel,
                                  )}`}
                                >
                                  {issue.priorityLevel}
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
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= VIEW MODAL ================= */}

      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-bold">
                {viewModal.title || viewModal.subject}
              </h2>

              <button
                onClick={() => setViewModal(null)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* BASIC INFO */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                  <h3 className="font-semibold text-gray-700">
                    Complaint Info
                  </h3>

                  <p>
                    <strong>Title:</strong> {viewModal.title}
                  </p>

                  <p>
                    <strong>Category:</strong> {viewModal.category || "N/A"}
                  </p>

                  <p>
                    <strong>Status:</strong> {viewModal.status}
                  </p>

                  <p>
                    <strong>Priority:</strong>
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        viewModal.priorityLevel,
                      )}`}
                    >
                      {viewModal.priorityLevel}
                    </span>
                  </p>
                </div>

                {/* LOCATION */}
                <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                  <h3 className="font-semibold text-gray-700">Location Info</h3>

                  <p>
                    <strong>Address:</strong> {viewModal.address}
                  </p>

                  
                </div>
              </div>

              {/* DESCRIPTION */}
              {viewModal.description && (
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Description
                  </h3>

                  <div className="bg-gray-50 p-4 rounded-xl border text-gray-700">
                    {viewModal.description}
                  </div>
                  
                </div>
              )}

              {/* IMAGE */}
              {viewModal.image && viewModal.image.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Complaint Image
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewModal.image.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="complaint"
                        className="rounded-xl object-cover w-full h-40 border shadow hover:scale-105 transition"
                      />
                    ))}
                  </div>
                </div>
              )}

              
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default IssueManagement;
