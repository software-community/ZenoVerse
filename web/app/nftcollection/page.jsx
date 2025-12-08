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
          celestialObservationData: {
            id: 7,
            name: "aries",
            mythology:
              "Aries is the winged Ram with the Golden Fleece. It was sent by the cloud nymph Nephele to save her children, Phrixus and Helle, from being sacrificed. Though Helle fell off and died, Phrixus survived and sacrificed the ram to Zeus, hanging its fleece in a sacred grove where it later became the object of Jason and the Argonauts' quest.",
            stars: 4,
            season: "Northern Autumn",
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
          celestialObservationData: {
            id: 46,
            name: "leo",
            mythology:
              "Leo is the Lion. It is generally identified as the Nemean Lion, a beast with an impenetrable hide that terrorized the countryside. Killing it was the first labor of Heracles, who strangled it with his bare hands and wore its skin as armor.",
            stars: 9,
            season: "Northern Spring",
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
          celestialObservationData: {
            id: 49,
            name: "libra",
            mythology:
              "Libra represents the Scales. It is the only zodiac sign that is an inanimate object. To the Greeks, these were the Scales of Justice held by the constellation Virgo (associated with Astraea, the goddess of justice). Ancient Romans were the first to consider it a distinct constellation, separating it from the claws of Scorpius.",
            stars: 4,
            season: "Northern Spring",
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
