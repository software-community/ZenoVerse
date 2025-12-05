"use client";
import React, { useState, useRef } from "react";
import ConnectWalletButton from "./ConnectWalletButton";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);


  const [underlineStyle, setUnderlineStyle] = useState({
    left: 0,
    width: 0,
    active: false,
  });

  const handleHover = (e) => {
    const link = e.currentTarget;
    const nav = navRef.current;
    if (nav && link) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();

      setUnderlineStyle({
        left: linkRect.left - navRect.left, // underline under the link
        width: linkRect.width,             // underline = link width
        active: true,
      });
    }
  };

  const handleLeave = () => {
    setUnderlineStyle((prev) => ({ ...prev, active: false }));
  };

  return (
    <nav
      ref={navRef}
      className="relative bg-[#070838] px-4 sm:px-6 md:px-10 py-4 flex flex-wrap items-center gap-4 sm:gap-8 w-full z-20 border-b-2 border-[#7407b8]"
    >
      {/* Logo */}
      <div className="mr-3 flex-shrink-0">
        <img
          src="/zenoverse_logo.png"
          alt="Zenoverse Logo"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-[#070838] to-[#7407b8] shadow-[0_0_16px_4px_#7407b8,0_0_0_6px_#070838_inset] p-2 hover:scale-110 hover:rotate-[360deg] transition-all duration-700"
        />
      </div>

      {/* Hamburger */}
      <button
        className="sm:hidden ml-auto text-white focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Nav Links */}
      <ul
        className={`${menuOpen ? "" : "hidden"
          } sm:flex gap-4 sm:gap-6 m-0 p-0 list-none w-full sm:w-auto flex-col sm:flex-row absolute sm:static top-full left-0 bg-[#070838] sm:bg-transparent shadow-lg sm:shadow-none rounded-b-2xl sm:rounded-none z-10`}
      >
        {[
          { href: "/", label: "Home" },
          { href: "/nftcollection", label: "NFT Collection" },
          { href: "https://iitrpr.ac.in/bost", label: "About Us" },
        ].map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
              className="block text-white no-underline px-6 sm:px-7 py-3 border-2 border-[#7407b8] rounded-full bg-gradient-to-r from-[#7407b8] to-[#070838] shadow-[0_0_16px_#7407b8,0_0_4px_#fff2] text-base sm:text-lg tracking-wide relative overflow-hidden text-center hover:bg-gradient-to-r hover:from-[#070838] hover:to-[#7407b8] hover:border-white hover:shadow-[0_0_24px_#7407b8,0_0_8px_#fff4]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* White line on navbar border below hovered button */}
      {underlineStyle.width > 0 && (
        <div
          className="absolute bottom-0 h-[2px] bg-white origin-center transition-transform duration-300"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
            transform: underlineStyle.active ? "scaleX(1)" : "scaleX(0)",
          }}
        />
      )}


      {/* Connect Wallet */}
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

