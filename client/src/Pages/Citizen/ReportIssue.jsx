import Footer from "@/components/Footer";
import DashboardNavbar from "@/components/DashboardNavbar";
import React, { useState, useEffect, useRef } from "react";
import { Loader2, Camera, MapPin, X, Mic } from "lucide-react";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";

const categoryMap = {
  en: [
    "Road & Transportation",
    "Garbage & Cleanliness",
    "Electricity",
    "Water Supply",
    "Drainage",
    "Safety",
  ],
  hi: [
    "सड़क और परिवहन",
    "कचरा और सफाई",
    "बिजली",
    "जल आपूर्ति",
    "नाली",
    "सुरक्षा",
  ],
  kn: [
    "ರಸ್ತೆ ಮತ್ತು ಸಾರಿಗೆ",
    "ಕಸ ಮತ್ತು ಸ್ವಚ್ಛತೆ",
    "ವಿದ್ಯುತ್",
    "ನೀರು ಸರಬರಾಜು",
    "ಚರಂಡಿ",
    "ಭದ್ರತೆ",
  ],
  te: [
    "రోడ్లు మరియు రవాణా",
    "చెత్త మరియు పరిశుభ్రత",
    "విద్యుత్",
    "నీటి సరఫరా",
    "డ్రైనేజ్",
    "భద్రత",
  ],
  ta: [
    "சாலை மற்றும் போக்குவரத்து",
    "குப்பை மற்றும் சுத்தம்",
    "மின்சாரம்",
    "தண்ணீர் வழங்கல்",
    "வடிகால்",
    "பாதுகாப்பு",
  ],
};

const ReportIssue = () => {
  const [language, setLanguage] = useState("en");

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

  /* SPEECH */

  const recognitionRef = useRef(null);
  const activeFieldRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  /* INITIALIZE SPEECH ONCE */

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      te: "te-IN",
      ta: "ta-IN",
    };

    recognition.lang = langMap[language];
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      const field = activeFieldRef.current;

      if (!field) return;

      setForm((prev) => ({
        ...prev,
        [field]: prev[field] ? prev[field] + " " + transcript : transcript,
      }));
    };

    recognition.onend = () => {
      setIsListening(false);
      activeFieldRef.current = null;
    };

    recognitionRef.current = recognition;
  }, [language]);

  const toggleVoice = (field) => {
    if (!recognitionRef.current) return;

    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      te: "te-IN",
      ta: "ta-IN",
    };

    // update language before starting
    recognitionRef.current.lang = langMap[language];

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      activeFieldRef.current = field;
      recognitionRef.current.start();
    }
  };

  /* TRANSLATE */

  const translateToEnglish = async (text) => {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`,
    );

    const data = await res.json();

    return data[0][0][0];
  };

  /* INPUT */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* LOCATION */

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("GPS Accuracy:", accuracy);

        setCoords({
          latitude,
          longitude,
        });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
          );

          const data = await res.json();

          setForm((prev) => ({
            ...prev,
            location: data.display_name || `${latitude}, ${longitude}`,
          }));
        } catch (err) {
          console.log("Reverse geocode error:", err);

          setForm((prev) => ({
            ...prev,
            location: `${latitude}, ${longitude}`,
          }));
        }

        setLocationLoading(false);
      },

      (error) => {
        setLocationLoading(false);

        if (error.code === 1) {
          alert("Location permission denied. Please allow GPS.");
        } else if (error.code === 2) {
          alert("Location unavailable.");
        } else if (error.code === 3) {
          alert("Location request timed out.");
        }
      },

      {
        enableHighAccuracy: true, // VERY IMPORTANT
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };
  /* IMAGES */

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* SUBMIT */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.description || !form.location) {
      return setMessage("Please fill all fields.");
    }

    setLoading(true);

    try {
      const titleEN = await translateToEnglish(form.title);
      const descEN = await translateToEnglish(form.description);

      const data = new FormData();

      data.append("title_original", form.title);
      data.append("title", titleEN);

      data.append("description_original", form.description);
      data.append("description", descEN);

      data.append("category", form.category);

      data.append("location", form.location);
      data.append("address", form.location);

      data.append("latitude", coords.latitude || "");
      data.append("longitude", coords.longitude || "");

      images.forEach((img) => {
        data.append("images", img);
      });

      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      const res = await apiClient.post("/issues/createIssue", data);

      toast.success(res.data.message);

      setForm({
        title: "",
        category: "",
        description: "",
        location: "",
      });

      setImages([]);
    } catch (err) {
      console.error(err);
      setMessage("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />

      {/* LANGUAGE SELECTOR */}

      <div className="flex justify-center mt-20">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="kn">Kannada</option>
          <option value="te">Telugu</option>
          <option value="ta">Tamil</option>
        </select>
      </div>

      {/* HEADER */}

      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-8 mt-4 text-center">
        <h1 className="text-3xl font-bold">Report a Civic Issue</h1>
        <p className="text-sm mt-2 opacity-90">
          Help your city improve by reporting problems instantly.
        </p>
      </section>

      {/* FORM */}

      <section className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 mb-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Issue Title
            </label>

            <div className="flex gap-2 items-center">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex: Pothole near bus stand"
                className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg"
              />

              <button
                type="button"
                onClick={() => toggleVoice("title")}
                className={`p-2 rounded-full ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-200"
                }`}
              >
                <Mic size={18} />
              </button>
            </div>
          </div>

          {/* CATEGORY */}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg"
            >
              <option value="">Select Category</option>

              {categoryMap[language].map((cat, i) => (
                <option key={i} value={categoryMap.en[i]}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* LOCATION */}

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
              className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg"
            />
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <div className="flex gap-2 items-start">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Explain the issue clearly..."
                className="w-full mt-1 px-4 py-2.5 text-sm border rounded-lg"
              />

              <button
                type="button"
                onClick={() => toggleVoice("description")}
                className={`p-2 rounded-full ${
                  isListening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-200"
                }`}
              >
                <Mic size={18} />
              </button>
            </div>
          </div>

          {/* IMAGE */}

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

          {message && (
            <p className="text-sm text-center text-blue-700">{message}</p>
          )}

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
