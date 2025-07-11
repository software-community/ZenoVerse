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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
              🎨 Image Verification
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>

          {/* Main Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            
            {/* Upload Section */}
            <div className="p-10 bg-gradient-to-br from-blue-50/80 to-indigo-50/80">
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Upload & Verify Your Image
                  </h3>
                </div>
              </div>
              
              {selectedImage ? (
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-white rounded-3xl p-4 shadow-xl">
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Preview"
                        className="w-full h-80 object-cover rounded-2xl"
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-blue-600 text-lg">📁</span>
                        </div>
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Filename</p>
                          <p className="text-blue-800 font-semibold truncate">{selectedImage.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                          <span className="text-indigo-600 text-lg">💾</span>
                        </div>
                        <div>
                          <p className="text-sm text-indigo-600 font-medium">File Size</p>
                          <p className="text-indigo-800 font-semibold">{(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-10"></div>
                  <div className="relative h-80 w-full flex items-center justify-center border-3 border-dashed border-blue-300 rounded-3xl bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300 group">
                    <div className="text-center">
                      <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">🖼️</div>
                      <p className="text-2xl font-bold text-blue-800 mb-3">No image selected</p>
                      <p className="text-blue-600">Upload an image to start verification</p>
                    </div>
                  </div>
                </div>
              )}

              <label className="mt-8 block cursor-pointer">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-10 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-center font-bold text-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105">
                  <span className="flex items-center justify-center space-x-3">
                    <span className="text-2xl">{selectedImage ? '📁' : '📤'}</span>
                    <span>{selectedImage ? 'Change Image' : 'Upload & Verify Image'}</span>
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Results Section */}
            {verificationResult && (
              <div className="p-10 border-t border-blue-100">
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">✓</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                      Verification Successful
                    </h3>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-200 shadow-xl">
                  <div className="flex items-center justify-center mb-6">
                    <div className="text-6xl">🎉</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-green-200">
                      <span className="text-green-600">🕒</span>
                      <span className="text-green-700 font-medium">
                        Verified at {new Date(verificationResult.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Popup */}
      {showLoadingPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full mx-4 text-center shadow-2xl border border-blue-100">
            <div className="mb-8">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🔍</span>
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Loading...</h3>
            <p className="text-blue-600 text-lg">Verifying your image authenticity</p>
          </div>
        </div>
      )}

      {/* Failure Popup */}
      {showFailurePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-12 max-w-md w-full mx-4 text-center shadow-2xl border border-red-100">
            <div className="mb-8 text-8xl">😔</div>
            <h3 className="text-3xl font-bold text-red-800 mb-6">Better luck next time!</h3>
            <p className="text-red-600 text-lg mb-8">
              Your image couldn't be verified as authentic. Please try with a different image.
            </p>
            <button
              onClick={handleFailureClose}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Okay, Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default VerificationForm;
