"use client";
import React from "react";
import ConnectWalletButton from "./ConnectWalletButton";

function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <nav className="flex items-center bg-[#070838] px-4 sm:px-6 md:px-10 py-4 shadow-lg gap-4 sm:gap-8 w-full flex-wrap relative z-20">
      <div className="mr-3 flex-shrink-0">
        <img
          src="/zenoverse_logo.png"
          alt="Zenoverse Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#070838] to-[#7407b8] shadow-[0_0_16px_4px_#7407b8,0_0_0_6px_#070838_inset] p-2"
          style={{
            filter: "drop-shadow(0 0 8px #7407b8) blur(0.5px)",
            transition: "box-shadow 0.4s, filter 0.4s",
          }}
        />
      </div>
      {/* Hamburger for mobile */}
      <button
        className="sm:hidden ml-auto text-white focus:outline-none"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <svg
          width="28"
          height="28"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Nav links */}
      <ul
        className={`${
          menuOpen ? "" : "hidden"
        } sm:flex gap-4 sm:gap-6 m-0 p-0 list-none w-full sm:w-auto flex-col sm:flex-row absolute sm:static top-full left-0 bg-[#070838] sm:bg-transparent shadow-lg sm:shadow-none rounded-b-2xl sm:rounded-none z-10`}
        style={{ display: menuOpen ? "flex" : undefined }}
      >
        <li>
          <a
            href="#home"
            className="block text-white no-underline px-6 sm:px-7 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#070838] shadow-[0_0_16px_#7407b8,0_0_4px_#fff2] text-base sm:text-lg tracking-wide transition-all duration-200 relative overflow-hidden hover:bg-gradient-to-r hover:from-[#070838] hover:to-[#7407b8] hover:border-white hover:shadow-[0_0_24px_#7407b8,0_0_8px_#fff4] text-center"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#nft"
            className="block text-white no-underline px-6 sm:px-7 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#070838] shadow-[0_0_16px_#7407b8,0_0_4px_#fff2] text-base sm:text-lg tracking-wide transition-all duration-200 relative overflow-hidden hover:bg-gradient-to-r hover:from-[#070838] hover:to-[#7407b8] hover:border-white hover:shadow-[0_0_24px_#7407b8,0_0_8px_#fff4] text-center"
          >
            NFT Collection
          </a>
        </li>
        <li>
          <a
            href="https://iitrpr.ac.in/bost/softcom"
            className="block text-white no-underline px-6 sm:px-7 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#070838] shadow-[0_0_16px_#7407b8,0_0_4px_#fff2] text-base sm:text-lg tracking-wide transition-all duration-200 relative overflow-hidden hover:bg-gradient-to-r hover:from-[#070838] hover:to-[#7407b8] hover:border-white hover:shadow-[0_0_24px_#7407b8,0_0_8px_#fff4] text-center"
          >
            About Us
          </a>
        </li>
      </ul>
      <div className="ml-auto hidden sm:block">
        <ConnectWalletButton />
      </div>
      {/* Mobile wallet button */}
      {menuOpen && (
        <div className="w-full flex justify-center py-2 sm:hidden">
          <ConnectWalletButton />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
