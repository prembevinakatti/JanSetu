import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const IssueManagement = () => {
  const [search, setSearch] = useState("");

  // Modal states
  const [viewModal, setViewModal] = useState(null);
  const [updateModal, setUpdateModal] = useState(null);

  // Update modal form states
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [proofImage, setProofImage] = useState(null);

  const issues = [
    {
      id: "JST-001",
      title: "Pothole near main road",
      category: "Road",
      citizen: "Rahul M",
      status: "In Progress",
      date: "03 Jan 2025",
      description: "A large pothole causing traffic slowdown.",
      location: "BTM Layout, Bengaluru",
    },
    {
      id: "JST-002",
      title: "Garbage not collected",
      category: "Cleanliness",
      citizen: "Ananya S",
      status: "Pending",
      date: "02 Jan 2025",
      description: "Trash overflowing in street corner.",
      location: "HSR 5th Sector, Bengaluru",
    },
    {
      id: "JST-003",
      title: "Streetlight not working",
      category: "Electricity",
      citizen: "Pooja L",
      status: "Resolved",
      date: "01 Jan 2025",
      description: "Streetlight flickering for last 3 days.",
      location: "Koramangala 1st Block",
    },
  ];

  // Handle proof image upload
  const handleProofImage = (e) => {
    setProofImage(e.target.files[0]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-4 px-6 mt-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">Issue Management</h1>
          <p className="mt-3 text-lg opacity-90">
            View, filter, and update all reported civic issues.
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="max-w-6xl mx-auto px-6 py-10 bg-white rounded-xl shadow-lg mt-8">
        <div className="grid md:grid-cols-3 gap-6">

          {/* Search */}
          <div>
            <label className="text-sm font-medium text-gray-700">Search Issue</label>
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select className="w-full mt-1 px-4 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500">
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select className="w-full mt-1 px-4 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500">
              <option>All</option>
              <option>Road</option>
              <option>Cleanliness</option>
              <option>Electricity</option>
              <option>Water</option>
              <option>Drainage</option>
            </select>
          </div>

        </div>
      </section>

      {/* ISSUE TABLE */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-blue-900 font-semibold">
              <tr>
                <th className="p-4">Issue ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Citizen</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{issue.id}</td>
                  <td className="p-4">{issue.title}</td>
                  <td className="p-4">{issue.category}</td>
                  <td className="p-4">{issue.citizen}</td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        issue.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : issue.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </td>

                  <td className="p-4">{issue.date}</td>

                  {/* Actions */}
                  <td className="p-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => setViewModal(issue)}
                      className="px-4 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-800 transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setUpdateModal(issue);
                        setNewStatus(issue.status);
                      }}
                      className="px-4 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </section>

      {/* VIEW MODAL */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">

            <h2 className="text-xl font-bold text-blue-900">
              {viewModal.title}
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              <p><strong>ID:</strong> {viewModal.id}</p>
              <p><strong>Category:</strong> {viewModal.category}</p>
              <p><strong>Citizen:</strong> {viewModal.citizen}</p>
              <p><strong>Location:</strong> {viewModal.location}</p>
              <p><strong>Description:</strong> {viewModal.description}</p>
              <p><strong>Status:</strong> {viewModal.status}</p>
            </div>

            <button
              onClick={() => setViewModal(null)}
              className="w-full mt-6 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {updateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl">

            <h2 className="text-xl font-bold text-blue-900">Update Issue</h2>

            {/* STATUS */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-lg text-sm"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            {/* REMARKS */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                rows="3"
                placeholder="Add notes..."
                className="w-full mt-1 px-4 py-2 border rounded-lg text-sm"
                onChange={(e) => setRemarks(e.target.value)}
              ></textarea>
            </div>

            {/* PROOF IMAGE */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Upload Proof</label>
              <input
                type="file"
                className="w-full mt-1 px-4 py-2 border rounded-lg text-sm bg-gray-50 cursor-pointer"
                onChange={handleProofImage}
              />

              {proofImage && (
                <img
                  src={URL.createObjectURL(proofImage)}
                  className="h-20 w-20 mt-3 rounded border object-cover"
                  alt="proof"
                />
              )}
            </div>

            {/* SUBMIT */}
            <button
              onClick={() => {
                alert("Issue Updated (Dummy). Connect to backend!");
                setUpdateModal(null);
              }}
              className="w-full mt-6 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
            >
              Update Issue
            </button>

            <button
              onClick={() => setUpdateModal(null)}
              className="w-full mt-3 bg-gray-200 text-gray-700 py-2 rounded-lg"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default IssueManagement;
