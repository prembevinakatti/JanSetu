import React, { useEffect, useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import Footer from "@/components/Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "@/utils/leafletIconFix";

const NearbyIssuesMap = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    // Replace later with backend API
    setIssues([
      {
        id: 1,
        title: "Pothole near Koramangala",
        status: "Reported",
        latitude: 12.9352,
        longitude: 77.6245,
      },
      {
        id: 2,
        title: "Garbage overflow in BTM Layout",
        status: "InProgress",
        latitude: 12.9155,
        longitude: 77.6101,
      },
      {
        id: 3,
        title: "Streetlight not working – HSR Layout",
        status: "Resolved",
        latitude: 12.9121,
        longitude: 77.6446,
      },
    ]);
  }, []);

  const getStatusColor = (status) =>
    status === "Resolved"
      ? "green"
      : status === "InProgress"
      ? "blue"
      : "orange";

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-14 px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Nearby Civic Issues</h1>
          <p className="mt-3 opacity-90">
            Free & open-source map powered by OpenStreetMap.
          </p>
        </div>
      </section>

      {/* MAP */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={13}
          className="h-[70vh] rounded-2xl shadow-xl border"
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
            >
              <Popup>
                <strong>{issue.title}</strong>
                <br />
                Status:{" "}
                <span
                  style={{
                    color: getStatusColor(issue.status),
                    fontWeight: "bold",
                  }}
                >
                  {issue.status}
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </section>

      <Footer />
    </div>
  );
};

export default NearbyIssuesMap;
