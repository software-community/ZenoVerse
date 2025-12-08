"use client";
import React, { useContext, useEffect } from "react";
import { accountContext } from "@/context/accountContext";
import NFTCard from "@/components/NftCard";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function NftCollectionPage() {
  const { NFTs, setNFTs } = useContext(accountContext);
  // Dummy NFT Data (ONLY for visualization)
  useEffect(() => {
    if (NFTs.length === 0) {
      setNFTs([
        {
      tokenId: 1,
      chain: "Ethereum",
      price: "0.42 ETH",
      metadata: {
        name: "Aries",
        image: "/ironman.jpg",
        confidence: 0.87,
      },
    },
    {
      tokenId: 2,
      chain: "Polygon",
      price: "0.12 ETH",
      metadata: {
        name: "Leo",
        image: "/profile.webp",
        confidence: 0.76,
      },
    },
    {
      tokenId: 3,
      chain: "Ethereum",
      price: "1.05 ETH",
      metadata: {
        name: "Libra",
        image: "/profile2.jpg",
        confidence: 0.93,
      },
    },
      ]);
    }
  }, [NFTs, setNFTs]);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/nftPageBgImage.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
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
              No NFTs found in your collection. Please connect your wallet to
              view your NFTs.
            </p>
          </div>
        )}
      </div>
      <ChatbotWidget />
    </div>
  );
}
