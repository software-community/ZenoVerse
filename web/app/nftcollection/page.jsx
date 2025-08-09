"use client";
import React, { useContext } from "react";
import { accountContext } from "@/context/accountContext";
import NFTCard from "@/components/NftCard";

export default function NftCollectionPage() {
  const { NFTs, setNFTs } = useContext(accountContext);
  return NFTs.length > 0 ? (
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
  );
}
