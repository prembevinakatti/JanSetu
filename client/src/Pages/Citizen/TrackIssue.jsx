import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TrackIssue = () => {
  const [issueId, setIssueId] = useState("");
  const [issueData, setIssueData] = useState(null);

  // Fake tracking result demo
  const handleTrack = () => {
    if (!issueId) return alert("Please enter an Issue ID!");

    // Dummy sample issue data (replace with backend call)
    const demo = {
      title: "Pothole near 5th Cross Road",
      category: "Road & Transportation",
      location: "BTM Layout, Bengaluru",
      status: "In Progress",
      timeline: [
        { step: "Submitted", time: "2 Jan • 9:30 AM", done: true },
        { step: "Verified", time: "2 Jan • 12:10 PM", done: true },
        { step: "In Progress", time: "3 Jan • 10:40 AM", done: true },
        { step: "Resolved", time: "Pending", done: false },
      ],
    };

    setIssueData(demo);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-4 px-6 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Track Your Issue</h1>
          <p className="mt-2 text-base opacity-90">Check the live status of your submitted issue.</p>
        </div>
      </section>

      {/* SEARCH CARD */}
      <section className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10">
        <h2 className="text-xl font-bold text-blue-900">Enter Issue ID</h2>
        <p className="text-gray-600 text-sm mb-4">Track your complaint using the unique ID.</p>

        <div className="flex gap-3">
          <input
            type="text"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            placeholder="Ex: JST-2024-00123"
            className="flex-1 px-4 py-2.5 border rounded-lg text-sm focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={handleTrack}
            className="bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-800 transition"
          >
            Track
          </button>
        </div>
      </section>

      {/* RESULT CARD */}
      {issueData && (
        <section className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-6 mb-20">

          {/* Issue Title */}
          <h2 className="text-2xl font-bold text-blue-900">{issueData.title}</h2>
          <p className="text-gray-500 text-sm mt-1">{issueData.category} • {issueData.location}</p>

          {/* Status Badge */}
          <div className="mt-4">
            <span
              className={`px-4 py-1.5 text-sm rounded-full font-semibold ${
                issueData.status === "Resolved"
                  ? "bg-green-600 text-white"
                  : issueData.status === "In Progress"
                  ? "bg-blue-600 text-white"
                  : "bg-orange-500 text-white"
              }`}
            >
              {issueData.status}
            </span>
          </div>

          {/* TIMELINE */}
          <div className="mt-8">
            <h3 className="font-bold text-blue-900 mb-4">Status Timeline</h3>

            <div className="space-y-4">
              {issueData.timeline.map((t, index) => (
                <div key={index} className="flex items-start gap-3">

                  {/* Status Dot */}
                  <div
                    className={`h-4 w-4 rounded-full mt-1 ${
                      t.done ? "bg-blue-700" : "bg-gray-400"
                    }`}
                  ></div>

                  {/* Step Details */}
                  <div>
                    <p className="font-semibold text-blue-900">{t.step}</p>
                    <p className="text-gray-500 text-xs">{t.time}</p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default TrackIssue;
