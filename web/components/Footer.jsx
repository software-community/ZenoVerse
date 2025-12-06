"use client";
import React from "react";
import Link from "next/link";
import { IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#070838] border-t-2 border-[#7407b8] font-orbitron text-white py-14 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Brand */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <img src="/zenoverse_logo.png" alt="Zenoverse" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full shadow-xl" />
            <div>
              <div className="text-xl sm:text-2xl font-bold">Zenoverse</div>
              <div className="text-base sm:text-sm text-white/80">Transform stargazing photos into NFTs</div>
            </div>
          </div>

          <p className="text-base text-white/70 max-w-md">
            Discover, collect and trade
            unique constellation NFTs powered by AI.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-start md:items-center">
          <h3 className="text-base font-semibold mb-4">Explore</h3>
          <nav className="flex flex-col space-y-3 text-base">
            <Link href="/" className="hover:text-[#7407b8] transition-colors">Home</Link>
            <Link href="/nftcollection" className="hover:text-[#7407b8] transition-colors">NFT Collection</Link>
            {/* <Link href="#verification" className="hover:text-[#7407b8] transition-colors">Verification</Link> */}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#5b3aa8] text-white/80 text-base">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} Zenoverse. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#7407b8]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#7407b8]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
