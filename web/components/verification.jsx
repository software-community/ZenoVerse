import React, { useState } from 'react';

const VerificationForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setVerificationResult(null);

      // Show loading popup and start verification
      setShowLoadingPopup(true);
      await verifyImage(e.target.files[0]);
    }
  };

  const verifyImage = async (imageFile = selectedImage) => {
    if (!imageFile) return;

    setIsVerifying(true);

    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Random success/failure (70% success rate)
      const isSuccess = Math.random() > 0.3;

      if (isSuccess) {
        // Mock successful verification result
        const mockResult = {
          timestamp: new Date().toISOString(),
          ipfsHash: 'QmMockHashForDemo123456789'
        };
        setVerificationResult(mockResult);
        setShowLoadingPopup(false);
      } else {
        // Show failure popup
        setShowLoadingPopup(false);
        setShowFailurePopup(true);
      }

    } catch (error) {
      console.error('Verification error:', error);
      setShowLoadingPopup(false);
      setShowFailurePopup(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleFailureClose = () => {
    setShowFailurePopup(false);
    setSelectedImage(null);
    setVerificationResult(null);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0b2b] to-[#1C1A44] py-12 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#7407b8] to-[#428cff] bg-clip-text text-transparent">
              🪐 Image Verification
            </h1>
            <p className="text-white/70 mt-3 text-lg">
              Upload a constellation image to verify its authenticity
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#7407b8] to-[#428cff] mx-auto mt-4 rounded-full" />
          </div>

          {/* Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">
            {/* Image Preview */}
            {selectedImage ? (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected"
                  className="w-full h-72 object-cover rounded-xl"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-72 rounded-2xl bg-white/10 border border-white/10 text-white/50 text-xl">
                 Upload an image to preview it here
              </div>
            )}

            {/* File Info */}
            {selectedImage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 border border-white/10 p-6 rounded-xl text-white/80">
                <div>
                  <p className="text-sm text-white/50">Filename</p>
                  <p className="font-medium truncate">{selectedImage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-white/50">File Size</p>
                  <p className="font-medium">
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <label className="block cursor-pointer">
              <div className="w-full text-center py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-[#7407b8] to-[#428cff] shadow-[0_0_15px_#7407b8] hover:from-[#428cff] hover:to-[#7407b8] hover:shadow-[0_0_25px_#7407b8] transition-all duration-300">
                {selectedImage ? "Change Image" : "Upload & Verify Image"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Result */}
            {verificationResult && (
              <div className="mt-6 bg-white/10 border border-white/10 p-6 rounded-xl text-center text-white">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="text-2xl font-bold mb-1">Verified Successfully</h3>
                <p className="text-white/70 text-sm">
                  At: {new Date(verificationResult.timestamp).toLocaleString()}
                </p>
                <p className="text-white/40 text-xs mt-1">
                  IPFS: {verificationResult.ipfsHash}
                </p>
                {/* Go to NFT Collection Button */}
                <a
                  href="/nftcollection"
                  className="mt-4 inline-block bg-gradient-to-r from-[#7407b8] to-[#428cff] px-6 py-3 rounded-full text-white font-semibold shadow-[0_0_15px_#7407b8] hover:shadow-[0_0_25px_#7407b8] hover:scale-105 transition-all"
                >
                  🚀 View in NFT Collection
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Popup */}
      {showLoadingPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-8 text-white text-center shadow-xl max-w-sm w-full">
            <div className="w-14 h-14 border-4 border-[#428cff] rounded-full animate-spin mx-auto mb-4 border-t-[#7407b8]" />
            <h3 className="text-xl font-semibold mb-2">Verifying...</h3>
            <p className="text-white/60">Analyzing constellation pattern</p>
          </div>
        </div>
      )}

      {/* Failure Popup */}
      {showFailurePopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 border border-red-400 rounded-2xl p-8 text-white text-center shadow-xl max-w-sm w-full">
            <div className="text-5xl mb-3">❌</div>
            <h3 className="text-2xl font-bold mb-2">Verification Failed</h3>
            <p className="text-red-300 mb-4 text-sm">
              Image couldn’t be verified. Try another.
            </p>
            <button
              onClick={handleFailureClose}
              className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-red-500 to-pink-500 shadow-[0_0_15px_#ff5c8d] hover:from-red-600 hover:to-pink-600 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationForm;
