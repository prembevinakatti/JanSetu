import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { Loader2, Camera, MapPin } from "lucide-react";

const ReportIssue = () => {
  const [description, setDescription] = useState("");
  const [aiPrediction, setAiPrediction] = useState(
    "AI will predict once you start typing..."
  );
  const [images, setImages] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState("");

  /* 🎤 Voice Input */
  const startVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return alert("Voice recognition not supported!");

    const recog = new SpeechRecognition();
    recog.lang = "en-IN";
    recog.start();

    recog.onresult = (e) => {
      setDescription(e.results[0][0].transcript);
      setAiPrediction("AI Prediction → Likely 'Road / Transportation'");
    };
  };

  /* 📍 GPS LOCATION */
  const getLocation = () => {
    if (!navigator.geolocation)
      return alert("GPS not supported in your browser!");

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setLocation(data?.display_name || "Location not found");
        } catch {
          alert("Failed to fetch area name");
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        alert("Unable to fetch location");
        setLocationLoading(false);
      }
    );
  };

  /* 📷 IMAGE UPLOAD / CAMERA */
  const handleImages = (e) => {
    setImages([...images, ...Array.from(e.target.files)]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-6 px-6 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Report an Issue</h1>
          <p className="mt-1 text-sm opacity-90">
            Help improve your local community
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10 mb-10">
        <form className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Issue Title
            </label>
            <input
              type="text"
              placeholder="Ex: Pothole near main road"
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400">
              <option>Select Category</option>
              <option>Road & Transportation</option>
              <option>Garbage & Cleanliness</option>
              <option>Streetlight / Electricity</option>
              <option>Water Supply</option>
              <option>Drainage</option>
              <option>Safety / Noise</option>
            </select>
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex justify-between">
              Location
              <button
                type="button"
                onClick={getLocation}
                className="flex items-center gap-1 text-xs text-blue-600"
              >
                {locationLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                Use GPS
              </button>
            </label>

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter area or use GPS"
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Upload Photos
            </label>

            <div className="mt-2 flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <Camera className="h-4 w-4" />
                Camera / Gallery
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  capture="environment"
                  onChange={handleImages}
                  hidden
                />
              </label>
            </div>
          </div>

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(img)}
                  alt="preview"
                  className="h-20 w-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-700 flex justify-between">
              Description
              <button
                type="button"
                onClick={startVoiceInput}
                className="text-xs text-orange-500 underline"
              >
                🎤 Voice Input
              </button>
            </label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setAiPrediction("AI Prediction → Analyzing...");
                setTimeout(() => {
                  setAiPrediction(
                    "AI Prediction → Looks like a 'Cleanliness' issue"
                  );
                }, 600);
              }}
              placeholder="Describe the issue clearly..."
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400"
            />

            <p className="mt-2 text-xs bg-blue-50 border border-blue-200 text-blue-700 p-2 rounded-lg">
              {aiPrediction}
            </p>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg text-sm font-semibold hover:bg-orange-600 transition"
          >
            Submit Issue
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default ReportIssue;
