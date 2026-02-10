import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AllIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);

  // SAMPLE ISSUE DATA
  const issues = [
    {
      id: "JST-201",
      title: "Water leakage near 5th cross",
      category: "Water",
      citizen: "Rohit Kumar",
      date: "14 Feb 2025",
      status: "Pending",
      description: "Water pipe leakage causing flooding in the street.",
      attachments: ["/images/water1.jpg", "/images/water2.jpg"],
      timeline: [
        { date: "14 Feb 2025", text: "Issue Reported" },
      ],
    },
    {
      id: "JST-202",
      title: "Streetlight blinking near park",
      category: "Electricity",
      citizen: "Sneha R",
      date: "13 Feb 2025",
      status: "In Progress",
      description: "Streetlight flickering heavily near the public park.",
      attachments: ["/images/light1.jpg"],
      timeline: [
        { date: "13 Feb 2025", text: "Issue Reported" },
        { date: "14 Feb 2025", text: "Assigned to Electric Dept." },
      ],
    },
    {
      id: "JST-203",
      title: "Garbage dumped near school",
      category: "Cleanliness",
      citizen: "Mahesh N",
      date: "10 Feb 2025",
      status: "Resolved",
      description: "Garbage thrown near the school road the entire week.",
      attachments: ["/images/garbage.jpg"],
      timeline: [
        { date: "10 Feb 2025", text: "Issue Reported" },
        { date: "11 Feb 2025", text: "Cleaned by BBMP workers" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-12 px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">All Reported Issues</h1>
          <p className="mt-2 opacity-90">Manage issues submitted by citizens.</p>
        </div>
      </section>

      {/* ISSUE CARDS */}
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 hover:shadow-2xl transition"
          >
            {/* IMAGE PREVIEW */}
            <img
              src={issue.attachments[0]}
              className="w-full h-40 object-cover rounded-lg mb-4"
              alt="issue"
            />

            <h2 className="text-xl font-bold text-blue-900">{issue.title}</h2>

            <p className="text-sm text-gray-600 mt-1">
              <strong>Category:</strong> {issue.category}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Citizen:</strong> {issue.citizen}
            </p>

            <p className="text-sm text-gray-600">
              <strong>Date:</strong> {issue.date}
            </p>

            {/* STATUS */}
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

            {/* BUTTON */}
            <button
              onClick={() => setSelectedIssue(issue)}
              className="w-full mt-4 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
            >
              View Details
            </button>
          </div>
        ))}

      </section>

      {/* ======================= VIEW MODAL ======================= */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white max-w-3xl w-full p-6 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">

            {/* HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-900">
                {selectedIssue.title}
              </h2>
              <button
                onClick={() => setSelectedIssue(null)}
                className="text-red-500 text-xl"
              >
                ✖
              </button>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-4 text-gray-700">{selectedIssue.description}</p>

            {/* IMAGES */}
            <h3 className="mt-6 font-semibold text-lg">Images</h3>
            <div className="flex gap-3 mt-2 flex-wrap">
              {selectedIssue.attachments.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-28 h-28 rounded-lg object-cover border"
                />
              ))}
            </div>

            {/* TIMELINE */}
            <h3 className="mt-6 font-semibold text-lg">Timeline</h3>
            <ul className="border-l-4 border-blue-700 pl-4 mt-2">
              {selectedIssue.timeline.map((step, i) => (
                <li key={i} className="mb-3">
                  <p className="font-semibold">{step.date}</p>
                  <p className="text-gray-600 text-sm">{step.text}</p>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedIssue(null)}
              className="w-full mt-6 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-800 transition"
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
