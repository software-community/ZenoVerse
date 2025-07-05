"use client";
import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";
const Navbar = () => {
  return (
    //The person working on navbar can make the necessary changes here just place the component ConnectWalletButton where you want the button
    <nav className="w-full px-6 py-4 border-b flex justify-between items-center p-4">
      <h1 className="text-xl font-semibold">ZenoVerse</h1>
      <ConnectWalletButton />
    </nav>
  );
}; 

export default Navbar;
