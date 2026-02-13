import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/api/apiClient";
import toast from "react-hot-toast";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.phone || !form.password) {
      return setMessage("All fields are required");
    }

    setLoading(true);
    setMessage("");

    console.log(form);
    try {
      const res = await apiClient.post("/admin/register", {
        ...form,
      });
      console.log(res.data);

      setMessage("✅ Admin registered successfully");

      if (res.data.success) {
        navigate("/adminlogin");
        toast.success("Admin registered successfully! Please login.");
      }
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">
        {/* LEFT SIDE */}
        <div className="bg-orange-400 text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold">
            Welcome, <span className="text-blue-900">New Admin</span>
          </h1>

          <p className="mt-3 text-sm">
            Create your JanSetu admin account to manage civic issues.
          </p>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-center text-blue-900">
              Admin Registration
            </h2>

            {message && (
              <p className="text-center text-sm mt-4 text-blue-700">
                {message}
              </p>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Admin Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/admin-login")}
                className="text-orange-500 font-semibold cursor-pointer"
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

export default AdminRegister;
