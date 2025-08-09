import React from "react";

const formatCompass = (lat, long) => {
  if (typeof lat !== "number" || typeof long !== "number") return null;
  const absLat = Math.abs(lat);
  const absLong = Math.abs(long);
  const latDir = lat >= 0 ? "N" : "S";
  const longDir = long >= 0 ? "E" : "W";
  return `${absLat.toFixed(2)}° ${latDir}, ${absLong.toFixed(2)}° ${longDir}`;
};

const formatTime = (iso) => {
  try {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const getImageSrc = (image) => {
  if (!image || typeof image !== "string") return "";
  const looksLikeBase64 = (s) =>
    s.startsWith("/9j/") ||
    s.startsWith("iVBOR") ||
    s.startsWith("R0lGOD") ||
    s.startsWith("Qk") ||
    s.startsWith("UklGR");
  const guessMime = (b64) => {
    if (b64.startsWith("/9j/")) return "image/jpeg";
    if (b64.startsWith("iVBOR")) return "image/png";
    if (b64.startsWith("R0lGOD")) return "image/gif";
    if (b64.startsWith("Qk")) return "image/bmp";
    if (b64.startsWith("UklGR")) return "image/webp";
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
  )
    return image;
  const mime = guessMime(image);
  return `data:${mime};base64,${image}`;
};

const NftCardModal = ({ nft, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-[92vw] max-w-5xl rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 text-neutral-700 hover:text-red-500 text-2xl leading-none z-10 bg-white/80 rounded-full w-9 h-9 flex items-center justify-center shadow"
          aria-label="Close"
        >
          ×
        </button>
        {/* Left: Image */}
        <div className="bg-neutral-100 flex items-center justify-center p-5">
          <img
            src={getImageSrc(nft?.image)}
            alt={nft?.name}
            className="max-h-[80vh] w-full object-contain rounded-lg"
          />
        </div>

        {/* Right: Details */}
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-neutral-900">{nft?.name}</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Token ID</span>
              <span className="font-medium">{nft?.tokenId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Price</span>
              <span className="font-medium">{nft?.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Chain</span>
              <span className="font-medium">{nft?.chain}</span>
            </div>
            {typeof nft?.confidence === "number" && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Confidence Score</span>
                <span className="font-medium">
                  {Math.round(nft.confidence * 100)}%
                </span>
              </div>
            )}
            {typeof nft?.lat === "number" && typeof nft?.long === "number" && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Location</span>
                <span className="font-medium">
                  {formatCompass(nft.lat, nft.long)}
                </span>
              </div>
            )}
            {nft?.timestamp && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Time</span>
                <span className="font-medium">{formatTime(nft.timestamp)}</span>
              </div>
            )}
            {nft?.description && (
              <div className="flex flex-col pt-3 border-t border-neutral-200">
                <span className="text-neutral-500 mb-1">Description</span>
                <span className="font-medium leading-relaxed text-neutral-800">
                  {nft.description}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftCardModal;
