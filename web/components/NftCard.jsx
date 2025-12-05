// import React, { useState } from "react";
// import NftCardModal from "./NftCardModal";

// // Helper to normalize image source (supports base64 strings and regular URLs)
// const getImageSrc = (image) => {
//   if (!image || typeof image !== "string") return "";
//   // Detect common base64 signatures first so "/9j/..." (jpeg) isn't mistaken for a path
//   const looksLikeBase64 = (s) => {
//     return (
//       s.startsWith("/9j/") || // JPEG
//       s.startsWith("iVBOR") || // PNG
//       s.startsWith("R0lGOD") || // GIF
//       s.startsWith("Qk") || // BMP
//       s.startsWith("UklGR") // WEBP
//     );
//   };
//   const guessMime = (b64) => {
//     if (b64.startsWith("/9j/")) return "image/jpeg"; // JPEG
//     if (b64.startsWith("iVBOR")) return "image/png"; // PNG
//     if (b64.startsWith("R0lGOD")) return "image/gif"; // GIF
//     if (b64.startsWith("Qk")) return "image/bmp"; // BMP
//     if (b64.startsWith("UklGR")) return "image/webp"; // WEBP
//     return "image/jpeg";
//   };

//   if (image.startsWith("data:")) return image;
//   if (looksLikeBase64(image)) {
//     const mime = guessMime(image);
//     return `data:${mime};base64,${image}`;
//   }
//   if (
//     image.startsWith("http") ||
//     image.startsWith("/") ||
//     image.startsWith("./")
//   ) {
//     return image;
//   }
//   const mime = guessMime(image);
//   return `data:${mime};base64,${image}`;
// };

// const NftCard = ({ nft }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleClick = () => {
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="group">
//       <div
//         className="relative overflow-hidden rounded-xl bg-white shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-300 hover:-translate-y-1 mx-4 my-6"
//         onClick={handleClick}
//         role="button"
//         tabIndex={0}
//       >
//         {/* NFT Image */}
//         <div className="relative h-48 sm:h-56 overflow-hidden">
//           <img
//             src={getImageSrc(nft.metadata.image)}
//             alt={nft.metadata.name}
//             className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//           />
//           {/* Dark overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

//           {/* Title overlay */}
//           <div className="absolute bottom-0 left-0 right-0 p-6">
//             <h2 className="text-white text-xl font-bold leading-tight line-clamp-2">
//               {nft.metadata.name}
//             </h2>
//           </div>
//         </div>

//         {/* Bottom Section */}
//         <div className="p-4 bg-white">
//           <div className="flex items-center justify-between mb-3">
//             <span className="text-primary-600 font-semibold">
//               Token ID: {nft.tokenId}
//             </span>
//             <span className="text-neutral-500 text-sm bg-neutral-100 px-2 py-1 rounded-full">
//               {nft.chain ? nft.chain : "Ethereum"}
//             </span>
//           </div>

//           {/* Price and Confidence */}
//           <div className="flex items-center justify-between">
//             <span className="text-lg font-bold text-green-600">
//               {nft.price ? nft.price : "00.00 ETH"}
//             </span>
//             {typeof nft.metadata.confidence === "number" && (
//               <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
//                 {Math.round(nft.metadata.confidence * 100)}% Confidence
//               </span>
//             )}
//           </div>
//         </div>
//       </div>
//       {isModalOpen && (
//         <NftCardModal nft={nft} onClose={() => setIsModalOpen(false)} />
//       )}
//     </div>
//   );
// };

// export default NftCard;
"use client"
import React, { useEffect, useState } from "react";
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

// Constellation information database

const NftCard = ({ nft }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    } else {
      setIsModalOpen(true);
      setIsFlipped(false); // Return to original state after opening modal
    }
  };

  const handleFlipBack = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  return (
    <div className="group perspective-1000">
      <div
        className="relative mx-4 my-6 transition-transform duration-700 preserve-3d cursor-pointer"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={handleClick}
      >
        {/* Front of card */}
        <div
          className="relative overflow-hidden rounded-xl bg-white shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
          role="button"
          tabIndex={0}
        >
          {/* NFT Image */}
          <div className="relative h-48 sm:h-56 overflow-hidden">
            <img
              src={getImageSrc(nft.metadata.image)}
              alt={nft.metadata.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Title overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h2 className="text-white text-xl font-bold leading-tight line-clamp-2">
                {nft.metadata.name}
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
                {nft.chain ? nft.chain : "Ethereum"}
              </span>
            </div>

            {/* Price and Confidence */}
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">
                {nft.price ? nft.price : "00.00 ETH"}
              </span>
              {typeof nft.metadata.confidence === "number" && (
                <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded">
                  {Math.round(nft.metadata.confidence * 100)}% Confidence
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={getImageSrc(nft.metadata.image)}
              alt={nft.metadata.name}
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />
          </div>

          {/* Backside Content Container */}
          <div
            className="relative h-full flex flex-col justify-between p-5 sm:p-6 overflow-y-auto"
            style={{
              scrollbarWidth: "thin", // Firefox
              scrollbarColor: "#a855f7 #00000000", // Firefox thumb & track
            }}
          >
            <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background-color: rgba(168, 85, 247, 0.6); /* purple-500/60 */
              border-radius: 9999px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background-color: rgba(168, 85, 247, 0.8); /* purple-500/80 */
            }
           `}</style>
            {/* Title */}
            <div className="text-center mt-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                {nft.metadata.name}
              </h3>
              <div className="h-0.5 mt-1 bg-gradient-to-r from-transparent via-yellow-400/70 to-transparent"></div>
            </div>

            {/* Mythology Card */}
            <div className="bg-black/35 backdrop-blur-sm rounded-xl p-4 border border-white/10 mt-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">✨</span>
                <div>
                  <h4 className="font-bold text-yellow-300 text-sm mb-1">Mythology</h4>
                  <p className="text-white/90 text-sm leading-relaxed">{nft.metadata.description}</p>
                </div>
              </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {/* Sky Info */}
              <div className="bg-black/35 backdrop-blur-sm rounded-xl p-4 border border-blue-400/20 text-center">
                <span className="text-2xl">☀️</span>
                <h4 className="font-bold text-blue-300 text-xs mt-2 mb-2">Sky Info</h4>
                <div className="text-xl font-bold text-white">{63}</div>
                <div className="text-xs text-white/70">stars</div>
                <div className="text-xs text-white/60 mt-2">{"Winter"}</div>
              </div>

              {/* Capture Info */}
              <div className="bg-black/35 backdrop-blur-sm rounded-xl p-4 border border-pink-400/20 text-center">
                <span className="text-2xl">📍</span>
                <h4 className="font-bold text-pink-300 text-xs mt-2 mb-2">Your Capture</h4>

                {typeof nft.metadata.confidence === "number" && (
                  <>
                    <div className="text-xl font-bold text-green-400">
                      {Math.round(nft.metadata.confidence * 100)}%
                    </div>
                    <div className="text-xs text-white/70">Match</div>
                  </>
                )}

                {nft.metadata.latitude && nft.metadata.longitude && (
                  <div className="text-xs text-white/60 mt-2">
                    {parseFloat(nft.metadata.latitude).toFixed(1)}°, {parseFloat(nft.metadata.longitude).toFixed(1)}°
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex gap-3 mt-5 mb-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex-1 bg-white/15 hover:bg-white/25 backdrop-blur-sm py-3 rounded-lg font-semibold transition border border-white/20 text-white"
              >
                ← Back
              </button>

              <button className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black py-3 rounded-lg font-bold transition shadow-md">
                Full Details →
              </button>
            </div>
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

