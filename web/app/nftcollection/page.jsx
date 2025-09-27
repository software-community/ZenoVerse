"use client";
import React, { useContext } from "react";
import { accountContext } from "@/context/accountContext";
import NFTCard from "@/components/NftCard";

export default function NftCollectionPage() {
  const { NFTs, setNFTs } = useContext(accountContext);
  
  return (
    <div className="relative min-h-screen w-full">
      {/* Background image with stars */}
      <div 
        className="absolute inset-0 z-0" 
        style={{
          backgroundImage: "url('/nftPageBgImage.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {NFTs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {NFTs.map((nft) => (
              <NFTCard nft={nft} key={nft.tokenId} />
            ))}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-24">
            <p className="text-white text-2xl md:text-3xl font-semibold text-center">
              No NFTs found in your collection. Please connect your wallet to view your NFTs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
