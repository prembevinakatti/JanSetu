import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useGetAllIssues from "@/hooks/useGetAllIssues";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import apiClient from "@/api/apiClient";

const AllIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);

  const { issues, loading } = useGetAllIssues();

  /* ================= FETCH ISSUE HISTORY ================= */

  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedIssue) return;

      try {
        setHistoryLoading(true);

        const res = await apiClient.get(
          `/history/getIssueHistory/${selectedIssue._id}`,
        );

        if (res.data.success) {
          const sorted = res.data.history.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
          );

          setHistory(sorted);
        }
      } catch (err) {
        console.log("Error fetching history:", err);
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [selectedIssue]);

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedIssue) return;

      try {
        setLoadingUsers(true);

        const res = await apiClient.get("/officers/all");

        if (res.data.success) {
          setUsers(res.data.officers);
        }
      } catch (error) {
        console.log("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [selectedIssue]);

  /* ================= ASSIGN ISSUE ================= */

  const assignIssue = async () => {
    if (!selectedUser) {
      alert("Please select a user");
      return;
    }

    try {
      setAssignLoading(true);
      console.log("Assigning issue to user:", selectedUser);
      console.log("Assigning issue :", selectedIssue);

      const res = await apiClient.post("/issues/assignIssue", {
        issueId: selectedIssue?._id,
        officerId: selectedUser,
      });

      if (res.data.success) {
        alert("Issue assigned successfully");
        setSelectedUser("");
      }
    } catch (error) {
      console.log("Assign error:", error);
    } finally {
      setAssignLoading(false);
    }
  };

  /* ================= DEADLINE ================= */

  const getDeadline = (priority) => {
    if (priority === "High")
      return "This issue must be resolved within 12 hours";

    if (priority === "Medium")
      return "This issue must be resolved within 24 hours";

    return "This issue must be resolved within 36 hours";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading issues...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HEADER */}

      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-12 px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">All Reported Issues</h1>
        </div>
      </section>

      {/* ================= ISSUE CARDS ================= */}

      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {issues?.map((issue) => (
          <div
            key={issue._id}
            className="bg-white rounded-xl shadow-lg p-5 border hover:shadow-2xl transition"
          >
            {issue.image?.length > 0 && (
              <img
                src={issue.image[0]}
                className="w-full h-40 object-cover rounded-lg mb-4"
                alt="issue"
              />
            )}

            <h2 className="text-xl font-bold text-blue-900">{issue.title}</h2>

            <p className="text-sm text-gray-600 mt-1">
              <strong>Category:</strong> {issue.category}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Citizen:</strong> {issue.createdBy?.username}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Date:</strong>{" "}
              {new Date(issue.createdAt).toLocaleDateString()}
            </p>

            {/* PRIORITY */}

            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold
                ${
                  issue.priorityLevel === "High"
                    ? "bg-red-100 text-red-700"
                    : issue.priorityLevel === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {issue.priorityLevel} Priority
              </span>
            </div>

            <p className="text-xs mt-2 text-gray-600 font-medium">
              ⏱ {getDeadline(issue.priorityLevel)}
            </p>

            {/* STATUS */}

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold
              ${
                issue.status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : issue.status === "InProgress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
              }`}
            >
              {issue.status}
            </span>

            <button
              onClick={() => setSelectedIssue(issue)}
              className="w-full mt-4 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
            >
              View Details
            </button>
          </div>
        ))}
      </section>

      {/* ================= MODAL ================= */}

      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white max-w-4xl w-full p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* HEADER */}

            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-blue-900">
                  {selectedIssue.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Reported on{" "}
                  {new Date(selectedIssue.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedIssue(null)}
                className="text-red-500 text-2xl"
              >
                ✖
              </button>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-900">
                Description
              </h3>

              <p className="mt-2 text-gray-700">{selectedIssue.description}</p>
            </div>

            {/* LOCATION */}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-900">Location</h3>

              <p className="text-gray-700 mt-1">{selectedIssue.address}</p>
            </div>

            {/* ================= ASSIGN SECTION ================= */}

            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Assign Issue
              </h3>

              {loadingUsers ? (
                <p>Loading users...</p>
              ) : (
                <div className="flex gap-3">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full"
                  >
                    <option value="">Select User</option>

                    {users?.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={assignIssue}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    {assignLoading ? "Assigning..." : "Assign"}
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedIssue(null)}
              className="w-full mt-8 bg-gray-800 text-white py-3 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AllIssues;
