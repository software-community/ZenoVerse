"use client";
import React from "react";
import Link from "next/link";
import { IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#070838] border-t-2 border-[#7407b8] font-orbitron text-white py-14 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
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
            Brought to you by SoftCom in collaboration with Iota Cluster, IIT Ropar. Discover, collect and trade
            unique constellation NFTs powered by AI.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-start md:items-center">
          <h3 className="text-base font-semibold mb-4">Explore</h3>
          <nav className="flex flex-col space-y-3 text-base">
            <Link href="/" className="hover:text-[#7407b8] transition-colors">Home</Link>
            <Link href="/nftcollection" className="hover:text-[#7407b8] transition-colors">NFT Collection</Link>
            <Link href="https://www.iitrpr.ac.in/bost/softcom" target="_blank" rel="noopener noreferrer" className="hover:text-[#7407b8] transition-colors">Projects</Link>
            {/* <Link href="#verification" className="hover:text-[#7407b8] transition-colors">Verification</Link> */}
          </nav>
        </div>

        {/* Social & Contact */}
        <div className="flex flex-col items-start md:items-end gap-4">
          <h3 className="text-base font-semibold">Connect</h3>
          <div className="flex items-center gap-4">
            <Link href="https://www.instagram.com/softcom_iitrpr/" target="_blank" aria-label="Instagram" className="hover:text-[#7407b8] transition-colors">
              <IconBrandInstagram size={30} />
            </Link>
            <Link href="https://www.linkedin.com/company/softcom-iitrpr/" target="_blank" aria-label="LinkedIn" className="hover:text-[#7407b8] transition-colors">
              <IconBrandLinkedin size={30} />
            </Link>
          </div>

          <div className="text-base text-white/70 text-right">
            <div>Contact: <a className="text-white/90 hover:text-[#7407b8]" href="mailto:softcom@iitrpr.ac.in">softcom@iitrpr.ac.in</a></div>
            <div className="text-sm text-white/50 mt-2">Made with <span className="text-red-400">♥</span> by <Link href="https://www.iitrpr.ac.in/bost/softcom" target="_blank" rel="noopener noreferrer" className="text-[#7407b8]">SoftCom</Link> and <Link href="https://www.iitrpr.ac.in/bost/iotacluster" target="_blank" rel="noopener noreferrer" className="text-[#7407b8]">Iota Cluster</Link></div>
          </div>
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
