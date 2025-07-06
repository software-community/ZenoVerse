// "use client";
"use client";
import React from "react";
import Link from "next/link";
import { IconBrandInstagram } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-6 bg-[#05062a] font-orbitron text-white text-sm mt-auto">
      <p className="text-center">
        <span>BoST, IIT Ropar | </span>
        Made with <span className="text-red-500">❤️</span> by{" "}
        <Link
          href="/softcom"
          className="font-bold tracking-widest text-[#a259f7] hover:underline"
        >
          SoftCom
        </Link>
      </p>
      <div className="w-full flex items-center justify-center mt-2 text-white">
        <span className="mr-2">Follow us on:</span>
        <Link
          href="https://www.instagram.com/bost.iitrpr"
          target="_blank"
          className="text-primary hover:text-[#a259f7] transition-colors"
        >
          <IconBrandInstagram className="ml-1" />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
