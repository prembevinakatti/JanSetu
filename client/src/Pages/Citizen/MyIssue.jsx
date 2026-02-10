import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { jsPDF } from "jspdf";

const MyIssue = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState(null);

  // SAMPLE ISSUE DATA (replace with API later)
  const issues = [
    {
      id: "JST-101",
      title: "Pothole near main road",
      category: "Road",
      date: "12 Feb 2025",
      status: "In Progress",
      description: "Large pothole near the main junction causing traffic blocks.",
      attachments: [
        "/images/pothole1.jpg",
        "/images/pothole2.jpg",
      ],
      timeline: [
        { date: "12 Feb 2025", text: "Issue Reported" },
        { date: "13 Feb 2025", text: "Assigned to Road Department" },
        { date: "14 Feb 2025", text: "Inspection Completed" },
      ],
    },
    {
      id: "JST-102",
      title: "Garbage not collected",
      category: "Cleanliness",
      date: "10 Feb 2025",
      status: "Pending",
      description: "Garbage bin overflowing for last 3 days.",
      attachments: ["/images/garbage.jpg"],
      timeline: [{ date: "10 Feb 2025", text: "Issue Reported" }],
    },
  ];

  /* -------------------------------------
        PDF DOWNLOAD
  ------------------------------------- */
  const downloadPDF = (issue) => {
    const doc = new jsPDF();
    doc.text(`JanSetu Issue Report`, 10, 10);
    doc.text(`Issue Title: ${issue.title}`, 10, 20);
    doc.text(`Issue ID: ${issue.id}`, 10, 30);
    doc.text(`Category: ${issue.category}`, 10, 40);
    doc.text(`Status: ${issue.status}`, 10, 50);
    doc.text(`Description: ${issue.description}`, 10, 60);
    doc.save(`${issue.id}-report.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-12 px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold">My Reported Issues</h1>
          <p className="mt-2 text-lg opacity-90">
            Track all issues you have submitted to JanSetu.
          </p>
        </div>
      </section>

      {/* ISSUE LIST */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-6">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white shadow-md rounded-xl p-6 border border-gray-200 flex justify-between items-center"
            >
              {/* LEFT INFO */}
              <div>
                <h3 className="text-xl font-semibold text-blue-900">
                  {issue.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Category: </strong>
                  {issue.category}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Reported: </strong>
                  {issue.date}
                </p>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="text-right">
                <span
                  className={`
                  px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    issue.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : issue.status === "In Progress"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }
                `}
                >
                  {issue.status}
                </span>

                <div className="mt-3 flex gap-3 justify-end">
                  <button
                    onClick={() => setSelectedIssue(issue)}
                    className="px-4 py-1.5 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800"
                  >
                    View
                  </button>

                  <button
                    onClick={() => setEditIssue(issue)}
                    className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== VIEW MODAL ====================== */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-xl">

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

            {/* STATUS METER */}
            <div className="mt-4">
              <p className="font-semibold text-gray-700 mb-2">Status Progress</p>
              <div className="w-full bg-gray-200 h-3 rounded-full">
                <div
                  className="h-3 bg-blue-700 rounded-full"
                  style={{
                    width:
                      selectedIssue.status === "Resolved"
                        ? "100%"
                        : selectedIssue.status === "In Progress"
                        ? "60%"
                        : "20%",
                  }}
                ></div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-5 text-gray-700">{selectedIssue.description}</p>

            {/* ATTACHMENTS */}
            <h3 className="mt-6 text-lg font-semibold">Attachments</h3>
            <div className="flex gap-3 mt-2 flex-wrap">
              {selectedIssue.attachments.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  className="w-24 h-24 rounded-lg border object-cover"
                />
              ))}
            </div>

            {/* TIMELINE */}
            <h3 className="mt-6 text-lg font-semibold">Timeline</h3>
            <ul className="border-l-4 border-blue-700 pl-4 mt-2">
              {selectedIssue.timeline.map((t, i) => (
                <li key={i} className="mb-3">
                  <p className="font-semibold">{t.date}</p>
                  <p className="text-gray-600 text-sm">{t.text}</p>
                </li>
              ))}
            </ul>

            {/* ACTION BUTTONS */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => downloadPDF(selectedIssue)}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Download PDF
              </button>

              <button
                onClick={() => setSelectedIssue(null)}
                className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ====================== EDIT MODAL ====================== */}
      {editIssue && (
        <EditIssueModal issue={editIssue} setEditIssue={setEditIssue} />
      )}

      <Footer />
    </div>
  );
};

/* ----------------------------------------------------------
    INTERNAL EDIT MODAL
---------------------------------------------------------- */

const EditIssueModal = ({ issue, setEditIssue }) => {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [attachments, setAttachments] = useState(issue.attachments);

  const handleUpdate = () => {
    alert("Issue updated successfully ✔");
    setEditIssue(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-xl">

        <h2 className="text-2xl font-bold text-blue-900 mb-4">Edit Issue</h2>

        {/* Title */}
        <label className="font-medium text-sm">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mt-1"
        />

        {/* Description */}
        <label className="font-medium text-sm mt-3 block">Description</label>
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg mt-1"
        ></textarea>

        {/* Attachments */}
        <label className="font-medium text-sm mt-3 block">Attachments</label>
        <input
          type="file"
          multiple
          onChange={(e) => {
            const arr = [...attachments];
            Array.from(e.target.files).forEach((file) =>
              arr.push(URL.createObjectURL(file))
            );
            setAttachments(arr);
          }}
        />

        <div className="flex gap-2 mt-3 flex-wrap">
          {attachments.map((img, i) => (
            <img key={i} src={img} className="w-20 h-20 rounded-lg border object-cover" />
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setEditIssue(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyIssue;
