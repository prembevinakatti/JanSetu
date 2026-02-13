import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import apiClient from "@/api/apiClient";

const AdminWalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Connect MetaMask */
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return setMessage("MetaMask not installed.");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);
      setMessage("Wallet connected ✅");
    } catch (err) {
      setMessage("Failed to connect wallet");
    }
  };

  /* Register as Admin On Chain */
  const handleAddAdmin = async () => {
    try {
      setLoading(true);
      setMessage("");

      await apiClient.post("/admin/addAdminWallet", {
        walletAddress,
      });

      setMessage("🎉 Admin added successfully on blockchain!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 animate-fadeIn">
      <Navbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white py-8 mt-16 animate-slideDown">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Admin Wallet Setup</h1>
          <p className="mt-2 text-sm opacity-90">
            Connect your MetaMask wallet to enable blockchain actions.
          </p>
        </div>
      </section>

      {/* CARD */}
      <section
        className={`max-w-xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-xl font-bold text-blue-900">
          Connect MetaMask
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          Your wallet will be registered as a blockchain admin.
        </p>

        {/* Connect Button */}
        <button
          onClick={connectWallet}
          className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
        >
          Connect Wallet
        </button>

        {/* Wallet Display */}
        {walletAddress && (
          <div className="mt-4 bg-gray-50 border rounded-lg p-3 text-sm break-all animate-slideUp">
            <strong>Connected:</strong>
            <p className="text-gray-700 mt-1">{walletAddress}</p>
          </div>
        )}

        {/* Add Admin */}
        <button
          onClick={handleAddAdmin}
          disabled={!walletAddress || loading}
          className="w-full mt-6 bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 transition-all duration-300 hover:scale-[1.02] active:scale-[0.97]"
        >
          {loading ? "Adding Admin..." : "Add as Blockchain Admin"}
        </button>

        {message && (
          <p className="text-center text-sm mt-4 text-blue-700 animate-fadeInSlow">
            {message}
          </p>
        )}
      </section>

      <Footer />

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInSlow {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }

        .animate-fadeInSlow {
          animation: fadeInSlow 0.6s ease forwards;
        }

        .animate-slideDown {
          animation: slideDown 0.7s ease forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminWalletConnect;
