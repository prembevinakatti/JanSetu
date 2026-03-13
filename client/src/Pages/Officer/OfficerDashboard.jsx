import { useEffect, useState } from "react";
import apiClient from "@/api/apiClient";

const OfficerDashboard = () => {

  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");

  /* ---------------- FETCH ASSIGNED ISSUES ---------------- */

  const fetchIssues = async () => {

    const res = await apiClient.get("/officers/assignedIssues");

    setIssues(res.data.issues);

  };

  useEffect(() => {

    fetchIssues();

  }, []);

  /* ---------------- UPDATE ISSUE STATUS ---------------- */

  const updateIssue = async () => {

    await apiClient.put(`/officers/updateIssue/${selectedIssue._id}`, {
      status,
      note
    });

    alert("Issue updated successfully");

    setSelectedIssue(null);

    fetchIssues();

  };

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h2 className="text-3xl font-bold text-indigo-700 mb-8">
        Assigned Civic Issues
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {issues.map((issue) => (

          <div
            key={issue._id}
            className="bg-white shadow-md hover:shadow-xl transition rounded-xl p-6 border"
          >

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {issue.title}
            </h3>

            <p className="text-sm text-indigo-600 font-medium mb-2">
              {issue.category}
            </p>

            <p className="text-sm text-gray-600">
              <span className="font-semibold">Location:</span> {issue.address}
            </p>

            {/* STATUS BADGE */}

            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold
              ${
                issue.status === "Resolved"
                  ? "bg-green-100 text-green-700"
                  : issue.status === "In Progress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {issue.status}
            </span>

            <button
              onClick={() => {
                setSelectedIssue(issue);
                setStatus(issue.status);
              }}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
            >
              Update
            </button>

          </div>

        ))}

      </div>

      {/* ---------------- UPDATE MODAL ---------------- */}

      {selectedIssue && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h3 className="text-xl font-semibold mb-4">
              Update Issue
            </h3>

            <label className="text-sm font-medium">Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded-lg"
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

            <label className="text-sm font-medium mt-4 block">
              Update Details
            </label>

            <textarea
              rows="3"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full mt-1 border px-3 py-2 rounded-lg"
              placeholder="Add work update..."
            />

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={updateIssue}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Save Update
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default OfficerDashboard;