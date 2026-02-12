import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import { Loader2, Camera, MapPin, X } from "lucide-react";
import apiClient from "@/api/apiClient";

const ReportIssue = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
  });
  const [coords, setCoords] = useState({
    latitude: null,
    longitude: null,
  });

  const [images, setImages] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* Handle input */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Get GPS location */
  const getLocation = () => {
    if (!navigator.geolocation) return alert("GPS not supported");

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          setCoords({ latitude, longitude }); // ✅ SAVE COORDS

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );

          const data = await res.json();

          setForm((prev) => ({
            ...prev,
            location: data.display_name || "",
          }));
        } catch {
          alert("Unable to fetch location");
        } finally {
          setLocationLoading(false);
        }
      },
      () => setLocationLoading(false),
    );
  };

  /* Handle images */
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* Submit Issue */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.description || !form.location) {
      return setMessage("Please fill all fields.");
    }

    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();

      // append text fields
      data.append("title", form.title);
      data.append("category", form.category);
      data.append("description", form.description);
      data.append("location", form.location);
      data.append("latitude", coords.latitude);
      data.append("address", form.location);
      data.append("longitude", coords.longitude);

      // append images
      images.forEach((img) => {
        data.append("images", img);
      });

      // DEBUG (optional)
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      // ❗ DO NOT pass headers here
      const res = await apiClient.post("/issues/createIssue", data);

      console.log(res.data);

      setMessage("✅ Issue submitted successfully!");
      setForm({ title: "", category: "", description: "", location: "" });
      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* HEADER */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-8 mt-16 text-center">
        <h1 className="text-3xl font-bold">Report a Civic Issue</h1>
        <p className="text-sm mt-2 opacity-90">
          Help your city improve by reporting problems instantly.
        </p>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Issue Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Pothole near bus stand"
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Select Category</option>
              <option>Road & Transportation</option>
              <option>Garbage & Cleanliness</option>
              <option>Electricity</option>
              <option>Water Supply</option>
              <option>Drainage</option>
              <option>Safety</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700">
              Location
              <button
                type="button"
                onClick={getLocation}
                className="text-blue-600 flex items-center gap-1 text-xs"
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
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Upload Photos
            </label>

            <label className="mt-2 flex items-center gap-2 px-4 py-2 text-sm border rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 w-fit">
              <Camera className="h-4 w-4" />
              Add Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImages}
                hidden
              />
            </label>
          </div>

          {/* Preview */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="h-20 w-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Explain the issue clearly..."
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Message */}
          {message && (
            <p className="text-sm text-center text-blue-700">{message}</p>
          )}

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Submit Issue"}
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default ReportIssue;
