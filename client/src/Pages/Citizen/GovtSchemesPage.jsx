import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

const GovtSchemesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
     <Navbar/>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-900 mt-16 via-blue-700 to-blue-500 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Government Schemes</h1>
          <p className="mt-3 text-lg opacity-90">
            Find the schemes you are eligible for and apply with ease
          </p>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <input
            type="text"
            placeholder="Search for schemes (ex: housing, education, women)"
            className="w-full md:w-2/3 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Category Filter */}
          <select className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-400">
            <option>All Categories</option>
            <option>Education</option>
            <option>Women Welfare</option>
            <option>Health</option>
            <option>Agriculture</option>
            <option>Housing</option>
          </select>
        </div>

        {/* SCHEMES GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* SCHEME CARD */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border-t-4 border-orange-500 transition">
            <h2 className="text-xl font-bold text-blue-900">PM Awas Yojana</h2>
            <p className="text-gray-600 mt-2">
              Housing support scheme for economically weaker sections.
            </p>
            <button className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
              View Details
            </button>
          </div>

          {/* SCHEME CARD */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border-t-4 border-blue-700 transition">
            <h2 className="text-xl font-bold text-blue-900">Ayushman Bharat</h2>
            <p className="text-gray-600 mt-2">
              Health insurance coverage for low-income families.
            </p>
            <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
              View Details
            </button>
          </div>

          {/* SCHEME CARD */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border-t-4 border-orange-500 transition">
            <h2 className="text-xl font-bold text-blue-900">PM Kisan Samman Nidhi</h2>
            <p className="text-gray-600 mt-2">
              Income support scheme for eligible farmers across India.
            </p>
            <button className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
              View Details
            </button>
          </div>

          {/* SCHEME CARD */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border-t-4 border-blue-700 transition">
            <h2 className="text-xl font-bold text-blue-900">Sukanya Samriddhi Yojana</h2>
            <p className="text-gray-600 mt-2">
              Savings and security scheme for girl children.
            </p>
            <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
              View Details
            </button>
          </div>

          {/* SCHEME CARD */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border-t-4 border-orange-500 transition">
            <h2 className="text-xl font-bold text-blue-900">National Scholarship Portal</h2>
            <p className="text-gray-600 mt-2">
              Scholarships for students based on category, merit, or need.
            </p>
            <button className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
              View Details
            </button>
          </div>

          {/* SCHEME CARD */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl border-t-4 border-blue-700 transition">
            <h2 className="text-xl font-bold text-blue-900">Ujjwala Yojana</h2>
            <p className="text-gray-600 mt-2">
              Financial support for LPG connections to rural households.
            </p>
            <button className="mt-5 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
              View Details
            </button>
          </div>

        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default GovtSchemesPage;
