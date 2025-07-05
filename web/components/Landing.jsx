"use client";
import React from "react";

const Landing = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white text-black">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Welcome to <span className="text-blue-600">ZenoVerse</span>
      </h1>
      <p className="text-lg md:text-xl max-w-xl text-gray-600 mb-8">
        Discover, create, and explore decentralized applications with ease.
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        Get Started
      </button>
    </section>
  );
};

export default Landing;
