import React, { useState } from "react";
import NftCardModal from "./NftCardModal";

// Helper to normalize image source (supports base64 strings and regular URLs)
const getImageSrc = (image) => {
  if (!image || typeof image !== "string") return "";
  // Detect common base64 signatures first so "/9j/..." (jpeg) isn't mistaken for a path
  const looksLikeBase64 = (s) => {
    return (
      s.startsWith("/9j/") || // JPEG
      s.startsWith("iVBOR") || // PNG
      s.startsWith("R0lGOD") || // GIF
      s.startsWith("Qk") || // BMP
      s.startsWith("UklGR") // WEBP
    );
  };
  const guessMime = (b64) => {
    if (b64.startsWith("/9j/")) return "image/jpeg"; // JPEG
    if (b64.startsWith("iVBOR")) return "image/png"; // PNG
    if (b64.startsWith("R0lGOD")) return "image/gif"; // GIF
    if (b64.startsWith("Qk")) return "image/bmp"; // BMP
    if (b64.startsWith("UklGR")) return "image/webp"; // WEBP
    return "image/jpeg";
  };

  if (image.startsWith("data:")) return image;
  if (looksLikeBase64(image)) {
    const mime = guessMime(image);
    return `data:${mime};base64,${image}`;
  }
  if (
    image.startsWith("http") ||
    image.startsWith("/") ||
    image.startsWith("./")
  ) {
    return image;
  }
  const mime = guessMime(image);
  return `data:${mime};base64,${image}`;
};

const NftCard = ({ nft }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="group">
      <div
        className="relative overflow-hidden rounded-xl bg-white shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-300 hover:-translate-y-1"
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        {/* NFT Image */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={getImageSrc(nft.image)}
            alt={nft.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white text-xl font-bold leading-tight line-clamp-2">
              {nft.name}
            </h2>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-primary-600 font-semibold">
              Token ID: {nft.tokenId}
            </span>
            <span className="text-neutral-500 text-sm bg-neutral-100 px-2 py-1 rounded-full">
              {nft.chain}
            </span>
          </div>

          {/* Price and Confidence */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-green-600">
              {nft.price}
            </span>
            {typeof nft.confidence === "number" && (
              <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                {Math.round(nft.confidence * 100)}% Confidence
              </span>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <NftCardModal nft={nft} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default NftCard;
