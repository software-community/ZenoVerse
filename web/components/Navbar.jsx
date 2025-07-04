"use client";
import React from 'react'
import ConnectWalletButton from './ConnectWalletButton';

const Navbar = () => {
  return (
    //The person working on navbar can make the necessary changes here just place the component ConnectWalletButton where you want the button
    <div className="flex justify-end items-center p-4">
        <ConnectWalletButton />
    </div>
  )
}

export default Navbar