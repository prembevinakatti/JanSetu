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

  const [viewModal, setViewModal] = useState(null);
  const [updateModal, setUpdateModal] = useState(null);

  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [proofImage, setProofImage] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateLocation, setUpdateLocation] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [updateCoords, setUpdateCoords] = useState(null);

  /* ---------------- FETCH ISSUES ---------------- */
  const fetchIssues = async () => {
    try {
      const res = await apiClient.get("/issues/getAllIssues");
      setIssues(res.data.issues);
      console.log(res.data.issues);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  /* ---------------- UPDATE ISSUE ---------------- */
  const handleUpdateIssue = async () => {
    try {
      setUpdating(true);

      const formData = new FormData();
      formData.append("status", newStatus);
      formData.append("remarks", remarks);

      if (updateLocation) {
        formData.append("address", updateLocation);
      }

      if (updateCoords) {
        formData.append("latitude", updateCoords.latitude);
        formData.append("longitude", updateCoords.longitude);
      }

      if (proofImage) {
        formData.append("proof", proofImage);
      }

      console.log(formData);

      await apiClient.put(
        `/history/updateHistory/${updateModal._id}`,
        formData,
      );

      // Reset everything properly
      setUpdateModal(null);
      setProofImage(null);
      setRemarks("");
      setUpdateLocation("");
      setUpdateCoords(null);
      setNewStatus("");

      fetchIssues();
    } catch (err) {
      console.log(err);
    } finally {
      setUpdating(false);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || issue.status === statusFilter;

    const matchesCategory =
      categoryFilter === "All" || issue.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading Issues...
      </div>
    );
  }
  const getCurrentLocation = () => {
    if (!navigator.geolocation) return alert("GPS not supported");

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );

          const data = await res.json();

          setUpdateLocation(data.display_name || "Location not found");
          setUpdateCoords({ latitude, longitude });
        } catch {
          alert("Failed to fetch location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => setLocationLoading(false),
    );
  };

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
        <div className="grid md:grid-cols-3 gap-4">
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
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue._id} className="border-t">
                  <td className="p-4">{issue.title}</td>
                  <td className="p-4">{issue.createdBy?.username}</td>
                  <td className="p-4">{issue.category}</td>
                  <td className="p-4">{issue.status}</td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => setViewModal(issue)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setUpdateModal(issue);
                        setNewStatus(issue.status);
                      }}
                      className="px-3 py-1 bg-orange-500 text-white rounded text-xs"
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
      {/* VIEW MODAL */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-900">
                {viewModal.title}
              </h2>
              <button
                onClick={() => setViewModal(null)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            {/* BASIC DETAILS */}
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Category:</strong> {viewModal.category}
              </p>

              <p>
                <strong>Status:</strong> {viewModal.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(viewModal.createdAt).toLocaleString()}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {viewModal.address ||
                  viewModal.location?.address ||
                  "Location not available"}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <h3 className="font-semibold text-lg">Description</h3>
              <p className="text-gray-700 mt-2">{viewModal.description}</p>
            </div>

            {/* IMAGES */}
            {viewModal.image?.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg">Images</h3>
                <div className="flex gap-3 mt-3 flex-wrap">
                  {viewModal.image.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="issue"
                      className="w-32 h-32 rounded-lg object-cover border"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* REPORTER DETAILS */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-lg mb-3">Reporter Details</h3>

              <p>
                <strong>Name:</strong>{" "}
                {viewModal.createdBy?.fullName || viewModal.createdBy?.username}
              </p>

              <p>
                <strong>Email:</strong> {viewModal.createdBy?.email}
              </p>

              <p>
                <strong>Phone:</strong> {viewModal.createdBy?.phoneNumber}
              </p>
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setViewModal(null)}
              className="w-full mt-6 bg-gray-800 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {updateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="border-b px-6 py-4">
              <h2 className="text-2xl font-bold text-blue-900">Update Issue</h2>
              <p className="text-sm text-gray-500 mt-1">{updateModal.title}</p>
            </div>

            <div className="p-6 space-y-5">
              {/* STATUS */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-300"
                >
                  <option value="Reported">Reported</option>
                  <option value="InProgress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              {/* LOCATION */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Update Location (Auto GPS)
                </label>

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full mt-2 bg-blue-50 border border-blue-200 text-blue-700 py-2.5 rounded-lg hover:bg-blue-100 transition"
                >
                  {locationLoading
                    ? "Fetching location..."
                    : "Use Current Location"}
                </button>

                {updateLocation && (
                  <p className="mt-2 text-sm bg-gray-50 border rounded-lg px-3 py-2 text-gray-600">
                    📍 {updateLocation}
                  </p>
                )}
              </div>

              {/* REMARKS */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Remarks
                </label>
                <textarea
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add update notes..."
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* UPLOAD */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Upload Proof Image
                </label>

                <label className="mt-2 flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <span className="text-2xl">📷</span>
                  <p className="text-sm font-medium text-gray-700 mt-1">
                    Click to upload proof image
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG • Max 5MB</p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setProofImage(e.target.files[0])}
                  />
                </label>

                {/* PREVIEW CARD */}
                {proofImage && (
                  <div className="mt-3 flex items-center gap-3 bg-gray-50 border rounded-lg p-3">
                    <img
                      src={URL.createObjectURL(proofImage)}
                      alt="proof"
                      className="w-16 h-16 rounded-lg object-cover border"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        {proofImage.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(proofImage.size / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setProofImage(null)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="border-t px-6 py-4 flex gap-3">
              <button
                onClick={handleUpdateIssue}
                disabled={updating}
                className="flex-1 bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600"
              >
                {updating ? "Updating..." : "Update Issue"}
              </button>

              <button
                onClick={() => setUpdateModal(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default IssueManagement;
