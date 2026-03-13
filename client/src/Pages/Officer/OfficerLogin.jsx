import { useState } from "react";
import apiClient from "@/api/apiClient";
import { useNavigate } from "react-router-dom";

const OfficerLogin = () => {

  const navigate = useNavigate();

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login = async(e)=>{
    e.preventDefault();

    const res = await apiClient.post("/worker/login",{ email,password });

    localStorage.setItem("officerToken",res.data.token);

    navigate("/worker/dashboard");
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Worker Login
        </h2>

        <form onSubmit={login} className="space-y-4">

          <input
            placeholder="Email Address"
            onChange={(e)=>setEmail(e.target.value)}
            className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg p-3 w-full outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            className="border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg p-3 w-full outline-none"
          />

          <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition">
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default OfficerLogin;