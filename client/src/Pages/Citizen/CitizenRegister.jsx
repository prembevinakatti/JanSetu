import React from "react";

const CitizenRegister = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 px-4">

      {/* TWO-COLUMN COMPACT CARD */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE CONTENT */}
        <div className="bg-orange-400 text-white p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold leading-tight">
            Join <span className="text-orange-400">JanSetu</span>
          </h1>

          <p className="mt-3 text-sm opacity-90 max-w-sm">
            Register to report civic issues, track updates, and participate in 
            community-driven transparent governance.
          </p>

          <p className="mt-5 text-xs opacity-80 border-l-4 border-orange-400 pl-3">
            Instant Registration • Quick Reporting • Verified Citizen Access
          </p>
        </div>

        {/* RIGHT SIDE REGISTER FORM */}
        <div className="p-10 flex items-center justify-center">
          <div className="w-full max-w-sm">

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-blue-900">Citizen Registration</h2>
            <p className="text-center text-gray-600 text-sm mt-1">
              Create your JanSetu citizen account
            </p>

            {/* Form */}
            <form className="mt-8 space-y-5">

              {/* Full Name */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-gray-700 text-sm font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 
                  focus:border-blue-700 focus:ring-1 focus:ring-blue-300 outline-none transition"
                />
              </div>

              

              {/* Register Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
              >
                Register
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <span className="text-blue-700 font-semibold cursor-pointer hover:underline">
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
