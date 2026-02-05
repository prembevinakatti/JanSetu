import React from "react";

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">

      {/* COMPACT TWO-COLUMN CARD */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE CONTENT */}
        <div className="bg-orange-400 text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold leading-tight">
            Welcome Back, <span className="text-orange-400">Admin</span>
          </h1>

          <p className="mt-3 text-sm opacity-90">
            Access the JanSetu administration panel to manage reported issues,
            oversee departments, and ensure transparent civic governance.
          </p>

          <p className="mt-5 text-xs opacity-80 border-l-4 border-orange-400 pl-3">
            Secure Login • Admin Access • Encrypted Authentication
          </p>
        </div>

        {/* RIGHT SIDE LOGIN FORM */}
        <div className="p-10 flex items-center justify-center">

          <div className="w-full max-w-sm">

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-blue-900">Admin Login</h2>
            <p className="text-center text-gray-600 text-sm mt-1">
              Login to access your admin panel
            </p>

            {/* Form */}
            <form className="mt-8 space-y-5">

              {/* Email */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Admin Email</label>
                <input
                  type="email"
                  placeholder="admin@jansetu.gov"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Login
              </button>
            </form>

            {/* Forgot password */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Forgot Password?{" "}
              <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
                Reset
              </span>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
