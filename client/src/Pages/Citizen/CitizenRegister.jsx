import apiClient from "@/api/apiClient";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CitizenRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiClient.post(`/auth/register`, form, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(res);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* LEFT */}
        <div className="bg-orange-400 text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold">Join JanSetu</h1>
          <p className="mt-3 text-sm">
            Register to report civic issues and track updates.
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center text-blue-900">
              Citizen Registration
            </h2>

            {error && (
              <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Full Name"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 text-white py-2 rounded-lg"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-700 cursor-pointer"
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenRegister;
