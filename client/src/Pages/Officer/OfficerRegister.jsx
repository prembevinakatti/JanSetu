import { useState } from "react";
import apiClient from "@/api/apiClient";

const OfficerRegister = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    phone: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await apiClient.post("/officers/register", form);
    alert(res.data.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Worker Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Full Name"
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg p-3 w-full outline-none"
          />

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e)=>setForm({...form,email:e.target.value})}
            className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg p-3 w-full outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setForm({...form,password:e.target.value})}
            className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg p-3 w-full outline-none"
          />

          {/* Department Dropdown */}
          <select
            onChange={(e)=>setForm({...form,department:e.target.value})}
            className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg p-3 w-full outline-none"
          >
            <option value="">Select Department</option>
            <option value="Roads">Roads Department</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Water">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Drainage">Drainage</option>
            <option value="Public Works">Public Works</option>
          </select>

          <input
            placeholder="Phone Number"
            onChange={(e)=>setForm({...form,phone:e.target.value})}
            className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg p-3 w-full outline-none"
          />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition">
            Register 
          </button>

        </form>

      </div>

    </div>
  );
};

export default OfficerRegister;