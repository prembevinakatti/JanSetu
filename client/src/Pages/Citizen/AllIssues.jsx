import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import useGetAllIssues from "@/hooks/useGetAllIssues";

const AllIssues = () => {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const { issues, loading } = useGetAllIssues();

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

      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-12 px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold">All Reported Issues</h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white rounded-xl shadow-lg p-5 border hover:shadow-2xl transition"
          >
            {/* Image */}
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

            {/* Status Badge */}
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

            {/* Blockchain Verification Badge */}
            <div className="mt-2">
              {issue.verificationStatus === "Verified" && (
                <span className="text-green-600 text-xs font-semibold">
                  ✔ Verified on Blockchain
                </span>
              )}

              {issue.verificationStatus === "Altered" && (
                <span className="text-red-600 text-xs font-semibold">
                  ⚠ Data Altered
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedIssue(issue)}
              className="w-full mt-4 bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </section>

      {/* Modal */}
      {/* Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white max-w-4xl w-full p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Header */}
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

            {/* Status + Blockchain */}
            <div className="flex gap-4 mt-4 items-center flex-wrap">
              <span
                className={`px-4 py-1 rounded-full text-xs font-semibold
            ${
              selectedIssue.status === "Resolved"
                ? "bg-green-100 text-green-700"
                : selectedIssue.status === "InProgress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-orange-100 text-orange-700"
            }`}
              >
                {selectedIssue.status}
              </span>

              {selectedIssue.verificationStatus === "Verified" && (
                <span className="text-green-600 text-xs font-semibold">
                  ✔ Verified on Blockchain
                </span>
              )}

              {selectedIssue.verificationStatus === "Altered" && (
                <span className="text-red-600 text-xs font-semibold">
                  ⚠ Data Altered
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-900">
                Description
              </h3>
              <p className="mt-2 text-gray-700">{selectedIssue.description}</p>
            </div>

            {/* Location */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-900">Location</h3>

              <p className="text-gray-700 mt-1">{selectedIssue.address}</p>
            </div>

            {/* Reporter Details */}
            <div className="mt-6 bg-gray-50 p-4 rounded-xl border">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Reporter Details
              </h3>

              <p className="text-sm">
                <strong>Name:</strong> {selectedIssue.createdBy?.username}
              </p>

              <p className="text-sm">
                <strong>Email:</strong> {selectedIssue.createdBy?.email}
              </p>

              <p className="text-sm">
                <strong>Phone:</strong> {selectedIssue.createdBy?.phoneNumber}
              </p>

              {selectedIssue.createdBy?.metamaskId && (
                <p className="text-sm break-all">
                  <strong>Wallet:</strong> {selectedIssue.createdBy?.metamaskId}
                </p>
              )}
            </div>

            {/* Blockchain Info */}
            {/* <div className="mt-6 bg-blue-50 p-4 rounded-xl border">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Blockchain Record
              </h3>

              <p className="text-sm break-all">
                <strong>Issue Hash:</strong> {selectedIssue.issueHash}
              </p>

              <p className="text-sm">
                <strong>Chain Issue ID:</strong> {selectedIssue.chainIssueId}
              </p>
            </div> */}

            {/* Images */}
            {selectedIssue.image?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-900">
                  Uploaded Images
                </h3>

                <div className="flex gap-3 mt-3 flex-wrap">
                  {selectedIssue.image.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="w-32 h-32 rounded-lg object-cover border hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>
            )}

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
