"use client";
import React from "react";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomePage from "../components/HomePage"; // Adjusted import path for HomePage
// HomePage does not exist in the provided structure, so comment it out or remove it
// import HomePage from './pages/HomePage';

export default function Page() {
  return (
    <>
      <HomePage/>
    </>
  );
}
