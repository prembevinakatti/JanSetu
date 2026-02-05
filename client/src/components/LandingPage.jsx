import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-white">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Text Section */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Bridging Citizens & Government  
              <span className="text-orange-400 block">With Transparency</span>
            </h1>

            <p className="mt-4 text-lg opacity-90 max-w-xl">
              JanSetu empowers citizens to report issues effortlessly and ensures complete 
              transparency with AI-powered classification and Blockchain-backed monitoring.
            </p>

            <div className="mt-6 flex gap-4">
              <button className="bg-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                Report Issue
              </button>

              <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-800 transition">
                Explore Features
              </button>
            </div>
          </motion.div>

          {/* Government Building Image */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="/src/assets/jansetu-govt-building.png"
              alt="Government Building Illustration"
              className="w-full h-80 object-cover rounded-xl shadow-xl border-4 border-white/20"
            />
          </motion.div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <motion.h2
            className="text-3xl font-bold text-blue-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Transforming Governance Through Innovation
          </motion.h2>

          <motion.p
            className="text-gray-600 mt-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Powered by AI, Blockchain & Citizen Collaboration
          </motion.p>

          <div className="grid md:grid-cols-3 gap-10 mt-12">

            {/* Feature 1 */}
            <motion.div
              className="p-8 bg-blue-50 rounded-xl border-l-4 border-blue-800 shadow-sm hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-blue-900">
                AI Issue Classification
              </h3>
              <p className="text-gray-600 mt-2">
                Automatically understands, groups, and prioritizes civic complaints.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="p-8 bg-orange-50 rounded-xl border-l-4 border-orange-500 shadow-sm hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-orange-600">
                Blockchain Transparency
              </h3>
              <p className="text-gray-600 mt-2">
                Every status update is permanently stored with no chance of manipulation.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="p-8 bg-blue-50 rounded-xl border-l-4 border-blue-800 shadow-sm hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-semibold text-blue-900">
                Community Voting
              </h3>
              <p className="text-gray-600 mt-2">
                Citizens can upvote issues that matter the most to amplify their priority.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6">

          <motion.h2
            className="text-3xl font-bold text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            How JanSetu Works
          </motion.h2>

          <div className="grid md:grid-cols-4 gap-8 mt-12">

            {[1, 2, 3, 4].map((step, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white/10 rounded-lg backdrop-blur-sm text-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold">
                  {step === 1 && "1. Report"}
                  {step === 2 && "2. AI Analyzes"}
                  {step === 3 && "3. Blockchain Logs"}
                  {step === 4 && "4. Government Resolves"}
                </h3>
                <p className="text-sm mt-2 opacity-80">
                  {step === 1 && "Submit issues via text, voice, images or GPS."}
                  {step === 2 && "AI classifies, predicts severity & filters duplicates."}
                  {step === 3 && "Issue history recorded immutably forever."}
                  {step === 4 && "Departments act & citizens track transparently."}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <motion.h2
            className="text-3xl font-bold text-blue-900"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            About JanSetu
          </motion.h2>

          <motion.p
            className="text-gray-600 mt-4 leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            JanSetu is a next-generation civic governance platform designed to bridge 
            the gap between citizens and government authorities. With AI-powered 
            classification and blockchain-backed transparency, we provide a trusted, 
            efficient, and corruption-free reporting ecosystem for every citizen.
          </motion.p>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <motion.h2
            className="text-3xl font-bold"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Raise Your Voice for Better Governance
          </motion.h2>

          <motion.p
            className="mt-3 text-lg opacity-90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Report issues that matter and bring real impact to your community.
          </motion.p>

          <motion.button
            className="mt-6 bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-100 transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            viewport={{ once: true }}
          >
            Start Reporting
          </motion.button>

        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default LandingPage;
