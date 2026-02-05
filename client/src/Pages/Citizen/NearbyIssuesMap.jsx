import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import mapboxgl from "mapbox-gl";

// Load token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const NearbyIssuesMap = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  const [lng, setLng] = useState(77.5946);
  const [lat, setLat] = useState(12.9716);
  const [zoom, setZoom] = useState(12);

  const [userLocation, setUserLocation] = useState(null);

  // Dummy Nearby Issues
  const issues = [
    {
      id: 1,
      title: "Pothole near Koramangala",
      status: "Pending",
      lat: 12.9352,
      lng: 77.6245,
    },
    {
      id: 2,
      title: "Garbage overflow in BTM Layout",
      status: "In Progress",
      lat: 12.9155,
      lng: 77.6101,
    },
    {
      id: 3,
      title: "Streetlight not working – HSR Layout",
      status: "Resolved",
      lat: 12.9121,
      lng: 77.6446,
    },
  ];

  // Initialize Map
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    // Update state while moving map
    mapRef.current.on("move", () => {
      setLng(mapRef.current.getCenter().lng.toFixed(4));
      setLat(mapRef.current.getCenter().lat.toFixed(4));
      setZoom(mapRef.current.getZoom().toFixed(2));
    });
  }, []);

  // Add markers for Issues
  useEffect(() => {
    if (!mapRef.current) return;

    issues.forEach((issue) => {
      const popup = new mapboxgl.Popup().setHTML(`
        <div style="font-family: sans-serif;">
          <strong>${issue.title}</strong><br>
          Status: <span style="color:${
            issue.status === "Resolved"
              ? "green"
              : issue.status === "In Progress"
              ? "blue"
              : "orange"
          };">
            ${issue.status}
          </span>
        </div>
      `);

      new mapboxgl.Marker({ color: "#f97316" }) // Orange
        .setLngLat([issue.lng, issue.lat])
        .setPopup(popup)
        .addTo(mapRef.current);
    });
  }, []);

  // Detect User Location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation({ latitude, longitude });

      // Add User Marker
      new mapboxgl.Marker({ color: "#1d4ed8" }) // Blue
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);

      // Move map to user
      mapRef.current.flyTo({
        center: [longitude, latitude],
        zoom: 14,
        essential: true,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-16 px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Nearby Issues Map</h1>
          <p className="mt-3 opacity-90">
            View civic issues around you on a live interactive map.
          </p>
        </div>
      </section>

      {/* MAP */}
      <section className="max-w-5xl mx-auto mt-10 px-4">
        <div
          ref={mapContainerRef}
          className="w-full h-[70vh] rounded-2xl shadow-xl border"
        ></div>
      </section>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default NearbyIssuesMap;
