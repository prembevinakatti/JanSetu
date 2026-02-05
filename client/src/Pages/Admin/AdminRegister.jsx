import React from "react";

const AdminRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">

      {/* COMPACT TWO-COLUMN CARD */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE CONTENT */}
        <div className="bg-orange-400 text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold leading-tight">
            Welcome, <span className="text-blue-900">New Admin</span>
          </h1>

          <p className="mt-3 text-sm opacity-90">
            Create your JanSetu admin account to securely manage civic issues, 
            departments, and governance operations.
          </p>

          <p className="mt-5 text-xs opacity-80 border-l-4 border-blue-900 pl-3">
            Secure Registration • Admin Access • Encrypted Platform
          </p>
        </div>

        {/* RIGHT SIDE REGISTER FORM */}
        <div className="p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-blue-900">Admin Registration</h2>
            <p className="text-center text-gray-600 text-sm mt-1">
              Create a new admin panel account
            </p>

            {/* Form */}
            <form className="mt-8 space-y-5">

              {/* Full Name */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Admin full name"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

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

              {/* Phone Number */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Create password"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Register
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <span className="text-orange-500 font-semibold cursor-pointer hover:underline">
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
