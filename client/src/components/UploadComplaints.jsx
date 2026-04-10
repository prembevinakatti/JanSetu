import React, { useState, useMemo } from "react";
import axios from "axios";

const priorityOrder = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const UploadComplaints = () => {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://localhost:3000/api/upload-complaints",
      formData
    );

    const sorted = res.data.sort(
      (a, b) =>
        priorityOrder[b.priorityLevel] - priorityOrder[a.priorityLevel]
    );

    
    setResults(sorted);
    console.log(sorted)
  };

  /* ================= HOTSPOTS ================= */

  const hotspots = useMemo(() => {
    const map = {};

    results.forEach((r) => {
      const words = r.text.split(" ");

      words.forEach((word) => {
        if (word[0] === word[0]?.toUpperCase()) {
          map[word] = (map[word] || 0) + 1;
        }
      });
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [results]);

  /* ================= DUPLICATES ================= */

  const duplicateClusters = useMemo(() => {
    const groups = {};

    results.forEach((r) => {
      const key = r.category;

      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });

    return Object.values(groups).filter((g) => g.length > 2);
  }, [results]);

  /* ================= PRIORITY COLORS ================= */

  const priorityColor = (p) => {
    if (p === "High") return "bg-red-100 text-red-600";
    if (p === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      {/* TITLE */}

      <h1 className="text-3xl font-bold mb-6">
        Bulk Complaint Analyzer
      </h1>

      {/* UPLOAD */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-lg font-semibold mb-4">
          Upload Complaint File
        </h2>

        <div className="flex gap-4">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />

          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
          >
            Upload & Analyze
          </button>

        </div>

      </div>

      {/* SUMMARY */}

      {results.length > 0 && (

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <SummaryCard title="Total Complaints" value={results.length} />

          <SummaryCard
            title="High Priority"
            value={results.filter(r => r.priorityLevel === "High").length}
            color="text-red-600"
          />

          <SummaryCard
            title="Medium Priority"
            value={results.filter(r => r.priorityLevel === "Medium").length}
            color="text-yellow-600"
          />

          <SummaryCard
            title="Low Priority"
            value={results.filter(r => r.priorityLevel === "Low").length}
            color="text-green-600"
          />

        </div>

      )}

      {/* HOTSPOTS */}

      {hotspots.length > 0 && (

        <div className="bg-white p-6 rounded-xl shadow mb-8">

          <h3 className="text-lg font-bold mb-4">
            Complaint Hotspots
          </h3>

          <ul>

            {hotspots.map(([area, count]) => (
              <li
                key={area}
                className="flex justify-between border-b py-2"
              >
                <span>{area}</span>
                <span className="text-red-600 font-semibold">
                  {count} complaints
                </span>
              </li>
            ))}

          </ul>

        </div>

      )}

      {/* DUPLICATES */}

      {duplicateClusters.length > 0 && (

        <div className="mb-8">

          <h3 className="text-lg font-bold mb-4">
            Duplicate Complaint Clusters
          </h3>

          {duplicateClusters.map((group, i) => (

            <div
              key={i}
              className="bg-orange-50 p-4 rounded-lg mb-4"
            >

              <p className="font-semibold">
                {group.length} similar complaints ({group[0].category})
              </p>

              {group.slice(0, 3).map((g, j) => (
                <p key={j} className="text-sm text-gray-600">
                  • {g.text}
                </p>
              ))}

            </div>

          ))}

        </div>

      )}

      {/* TABLE */}

      {results.length > 0 && (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-100 text-sm font-semibold">

              <tr>
                <th className="p-4">Complaint</th>
                <th className="p-4">Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Sentiment</th>
              </tr>

            </thead>

            <tbody>

              {results.map((r, i) => (

                <tr
                  key={i}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="p-4">{r.text}</td>

                  <td className="p-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">
                      {r.category}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColor(
                        r.priorityLevel
                      )}`}
                    >
                      {r.priorityLevel}
                    </span>
                  </td>

                  <td className="p-4">
                    {r.sentiment?.label}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

/* ================= SUMMARY CARD ================= */

const SummaryCard = ({ title, value, color = "text-gray-900" }) => (
  <div className="bg-white p-6 rounded-xl shadow text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default UploadComplaints;