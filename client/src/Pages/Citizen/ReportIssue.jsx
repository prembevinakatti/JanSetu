import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";

const ReportIssue = () => {
  const [description, setDescription] = useState("");
  const [aiPrediction, setAiPrediction] = useState("AI will predict once you start typing...");
  const [images, setImages] = useState([]);

  // Voice Input
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice recognition not supported!");

    const recog = new SpeechRecognition();
    recog.lang = "en-IN";
    recog.start();

    recog.onresult = (e) => {
      setDescription(e.results[0][0].transcript);
      setAiPrediction("AI Prediction → Likely 'Road / Transportation'");
    };
  };

  // GPS → AREA NAME
  const getLocation = () => {
    if (!navigator.geolocation) return alert("GPS not supported!");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await res.json();
          const address = data?.display_name || "Area not found";

          document.getElementById("locationInput").value = address;
        } catch {
          alert("Unable to fetch area name!");
        }
      },
      () => alert("Unable to fetch location!")
    );
  };

  // MULTI IMAGE UPLOAD
  const handleImages = (e) => setImages([...e.target.files]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-5 px-6 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Report an Issue</h1>
          <p className="mt-2 text-base opacity-90">Help improve your community.</p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10">

        {/* TITLE */}
        <h2 className="text-xl font-bold text-blue-900">Issue Details</h2>
        <p className="text-gray-600 text-sm mb-4">Provide accurate information.</p>

        <form className="space-y-6">

          {/* 2x2 GRID */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* ISSUE TITLE */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Issue Title</label>
              <input
                type="text"
                placeholder="Ex: Pothole near main road"
                className="w-full mt-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Category</label>
              <select className="w-full mt-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-1 focus:ring-blue-400">
                <option>Select Category</option>
                <option>Road & Transportation</option>
                <option>Garbage & Cleanliness</option>
                <option>Streetlight / Electricity</option>
                <option>Water Supply</option>
                <option>Drainage</option>
                <option>Noise / Safety</option>
              </select>
            </div>

            {/* LOCATION */}
            <div className="md:col-span-1">
              <label className="text-gray-700 text-sm font-medium flex justify-between">
                Location
                <button
                  type="button"
                  onClick={getLocation}
                  className="text-blue-700 text-xs underline"
                >
                  📍 Use GPS
                </button>
              </label>

              <input
                id="locationInput"
                type="text"
                placeholder="Enter area name or use GPS"
                className="w-full mt-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="text-gray-700 text-sm font-medium">Upload Images</label>
              <input
                type="file"
                multiple
                onChange={handleImages}
                className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-gray-50 cursor-pointer"
              />
            </div>
          </div>

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="mt-2 flex gap-3 flex-wrap">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="h-16 w-16 rounded-lg border object-cover"
                />
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <label className="text-gray-700 text-sm font-medium flex justify-between">
              Description
              <button
                type="button"
                onClick={startVoiceInput}
                className="text-orange-500 text-xs underline"
              >
                🎤 Voice Input
              </button>
            </label>

            <textarea
              rows="3"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setAiPrediction("AI Prediction → Analyzing...");
                setTimeout(() => {
                  setAiPrediction("AI Prediction → Looks like a 'Cleanliness' issue.");
                }, 600);
              }}
              placeholder="Describe the issue clearly…"
              className="w-full mt-1 px-3 py-2.5 text-sm border rounded-lg focus:ring-1 focus:ring-blue-400"
            ></textarea>

            {/* AI BOX */}
            <p className="mt-2 text-sm bg-blue-50 border border-blue-200 text-blue-700 p-2 rounded-lg">
              {aiPrediction}
            </p>
          </div>

          {/* SUBMIT */}
          <button className="w-full bg-orange-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-600 transition">
            Submit Issue
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default ReportIssue;
