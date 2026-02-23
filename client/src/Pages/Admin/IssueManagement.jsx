import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/apiClient";

const IssueManagement = () => {
  const [webIssues, setWebIssues] = useState([]);
  const [emailIssues, setEmailIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewModal, setViewModal] = useState(null);

  console.log(webIssues);

  /* ================= FETCH BOTH ================= */
  const fetchAllComplaints = async () => {
    try {
      setLoading(true);

      const [webRes, emailRes] = await Promise.all([
        apiClient.get("/issues/getIssueByFilter"),
        apiClient.get("emailComplaints/getAllEmailComplaints"),
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

      {/* 🔥 HIGH PRIORITY SECTION */}
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

        <div className="bg-white rounded-xl shadow overflow-x-auto">
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
              {webIssues.map((issue) => (
                <tr key={issue._id} className="border-t">
                  <td className="p-4">{issue.title}</td>
                  <td className="p-4">{issue.createdBy?.username}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= EMAIL COMPLAINTS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">
          Email Complaints
        </h2>

        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">From</th>
                <th className="p-4">AI Priority</th>
                <th className="p-4">Sentiment</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {emailIssues.map((mail) => (
                <tr key={mail._id} className="border-t">
                  <td className="p-4">{mail.subject}</td>
                  <td className="p-4">{mail.from}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(
                        mail.aiPriorityLevel,
                      )}`}
                    >
                      {mail.aiPriorityLevel}
                    </span>
                  </td>
                  <td className="p-4">
                    {mail.aiSentiment?.label} (
                    {mail.aiSentiment?.score?.toFixed(2)})
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setViewModal(mail)}
                      className="px-3 py-1 bg-purple-600 text-white rounded text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================= VIEW MODAL ================= */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* HEADER */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {viewModal.title || viewModal.subject}
              </h2>
              <button
                onClick={() => setViewModal(null)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* ================= WEB COMPLAINT UI ================= */}
              {viewModal.category && (
                <>
                  {/* STATUS & PRIORITY BADGES */}
                  <div className="flex gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {viewModal.category}
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                ${viewModal.priorityLevel === "High" && "bg-red-100 text-red-600"}
                ${viewModal.priorityLevel === "Medium" && "bg-yellow-100 text-yellow-700"}
                ${viewModal.priorityLevel === "Low" && "bg-green-100 text-green-600"}
              `}
                    >
                      {viewModal.priorityLevel}
                    </span>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {viewModal.status}
                    </span>

                    {viewModal.isEmergency && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white">
                        🚨 Emergency
                      </span>
                    )}
                  </div>

                  {/* INFO GRID */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* LEFT */}
                    <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                      <h3 className="font-semibold text-gray-700">
                        Issue Details
                      </h3>
                      <p>
                        <strong>Priority Score:</strong>{" "}
                        {viewModal.priorityScore}
                      </p>

                      <p>
                        <strong>Cluster ID:</strong>{" "}
                        {viewModal.clusterId || "N/A"}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                      <h3 className="font-semibold text-gray-700">
                        Location Info
                      </h3>
                      <p>
                        <strong>Address:</strong> {viewModal.address}
                      </p>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Description
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl border text-gray-700">
                      {viewModal.description}
                    </div>
                  </div>

                  {/* IMAGES */}
                  {viewModal.image?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800 mb-3">
                        Images
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {viewModal.image.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="issue"
                            className="rounded-xl object-cover w-full h-40 border shadow-sm hover:scale-105 transition"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* REPORTER */}
                  <div className="bg-gray-50 p-4 rounded-xl border space-y-1">
                    <h3 className="font-semibold text-gray-700">
                      Reporter Information
                    </h3>
                    <p>
                      <strong>Name:</strong> {viewModal.createdBy?.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {viewModal.createdBy?.email}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {new Date(viewModal.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Updated:</strong>{" "}
                      {new Date(viewModal.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}

              {/* ================= EMAIL COMPLAINT UI ================= */}
              {viewModal.body && (
                <>
                  <div className="flex gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      Email Complaint
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                ${viewModal.aiPriorityLevel === "High" && "bg-red-100 text-red-600"}
                ${viewModal.aiPriorityLevel === "Medium" && "bg-yellow-100 text-yellow-700"}
                ${viewModal.aiPriorityLevel === "Low" && "bg-green-100 text-green-600"}
              `}
                    >
                      {viewModal.aiPriorityLevel}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                      <h3 className="font-semibold text-gray-700">
                        AI Analysis
                      </h3>
                      <p>
                        <strong>Priority Score:</strong>{" "}
                        {viewModal.aiPriorityScore}
                      </p>
                      <p>
                        <strong>Sentiment:</strong>{" "}
                        {viewModal.aiSentiment?.label} (
                        {viewModal.aiSentiment?.score?.toFixed(2)})
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
                      <h3 className="font-semibold text-gray-700">
                        Sender Info
                      </h3>
                      <p>
                        <strong>From:</strong> {viewModal.from}
                      </p>
                      <p>
                        <strong>Received:</strong>{" "}
                        {new Date(viewModal.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Email Body
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl border text-gray-700 whitespace-pre-line">
                      {viewModal.body}
                    </div>
                  </div>
                </>
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
