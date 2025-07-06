"use client";
import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";

function Navbar() {
  return (
    <nav className="flex items-center bg-[#070838] px-10 py-4 shadow-lg gap-8 w-full">
      <div className="mr-3">
        <img
          src="/zenoverse_logo.png"
          alt="Zenoverse Logo"
          className="h-12 w-12 rounded-full bg-gradient-to-br from-[#070838] to-[#7407b8] shadow-[0_0_16px_4px_#7407b8,0_0_0_6px_#070838_inset] p-2"
          style={{
            filter: "drop-shadow(0 0 8px #7407b8) blur(0.5px)",
            transition: "box-shadow 0.4s, filter 0.4s",
          }}
        />
      </div>
      <ul className="flex gap-6 m-0 p-0 list-none">
        <li>
          <a
            href="#home"
            className="text-white no-underline px-7 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#070838] shadow-[0_0_16px_#7407b8,0_0_4px_#fff2] text-lg tracking-wide transition-all duration-200 relative overflow-hidden hover:bg-gradient-to-r hover:from-[#070838] hover:to-[#7407b8] hover:border-white hover:shadow-[0_0_24px_#7407b8,0_0_8px_#fff4]"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#nft"
            className="text-white no-underline px-7 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#070838] shadow-[0_0_16px_#7407b8,0_0_4px_#fff2] text-lg tracking-wide transition-all duration-200 relative overflow-hidden hover:bg-gradient-to-r hover:from-[#070838] hover:to-[#7407b8] hover:border-white hover:shadow-[0_0_24px_#7407b8,0_0_8px_#fff4]"
          >
            NFT Collection
          </a>
        </li>
        <li>
          <a
            href="https://iitrpr.ac.in/bost/softcom"
            className="text-white no-underline px-7 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#070838] shadow-[0_0_16px_#7407b8,0_0_4px_#fff2] text-lg tracking-wide transition-all duration-200 relative overflow-hidden hover:bg-gradient-to-r hover:from-[#070838] hover:to-[#7407b8] hover:border-white hover:shadow-[0_0_24px_#7407b8,0_0_8px_#fff4]"
          >
            About Us
          </a>
        </li>
      </ul>
      <div className="ml-auto">
        <ConnectWalletButton />
      </div>
    </nav>
  );
}

export default Navbar;
