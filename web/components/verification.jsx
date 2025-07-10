import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const VerificationForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0].address);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Failed to connect wallet');
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress('');
    setIsConnected(false);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setVerificationResult(null);
    }
  };

  const uploadToIPFS = async (file) => {
    // Mock IPFS upload - replace with actual IPFS implementation
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Replace with your actual IPFS endpoint
      const response = await fetch('/api/upload-to-ipfs', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }
      
      const data = await response.json();
      return data.hash; // Return IPFS hash
    } catch (error) {
      console.error('IPFS upload error:', error);
      // Mock hash for demo purposes
      return 'QmMockHashForDemo123456789';
    }
  };

  const verifyImage = async () => {
    if (!selectedImage || !isConnected) {
      alert('Please select an image and connect your wallet');
      return;
    }

    setIsVerifying(true);
    
    try {
      // Upload to IPFS
      const hash = await uploadToIPFS(selectedImage);
      setIpfsHash(hash);

      // Call image classification API
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch('/api/verify-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      
      // Sign the verification result with wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const message = `Image verification: ${result.classification} at ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      setVerificationResult({
        ...result,
        signature,
        timestamp: new Date().toISOString(),
        ipfsHash: hash
      });

    } catch (error) {
      console.error('Verification error:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const mintNFT = async () => {
    if (!verificationResult || !isConnected) {
      alert('Please complete verification first');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Replace with your actual NFT contract address and ABI
      const contractAddress = "0x..."; // Your contract address
      const contractABI = [
        "function mint(address to, string memory tokenURI) public returns (uint256)"
      ];
      
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      
      const tokenURI = `ipfs://${verificationResult.ipfsHash}`;
      const tx = await contract.mint(walletAddress, tokenURI);
      
      await tx.wait();
      alert('NFT minted successfully!');
      
    } catch (error) {
      console.error('Minting error:', error);
      alert('Failed to mint NFT');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-3xl font-bold text-center text-blue-800">Image Verification</h2>

      {/* Image Upload Section */}
      <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Upload Image for Verification</h3>
        
        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="w-full h-64 object-contain border border-blue-300 rounded-lg"
            />
            <div className="text-sm text-blue-600">
              <p><strong>File:</strong> {selectedImage.name}</p>
              <p><strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="h-64 w-full flex items-center justify-center text-blue-400 border-2 border-dashed border-blue-300 rounded-lg">
            <div className="text-center">
              <p className="text-lg mb-2">No image selected</p>
              <p className="text-sm">Choose an image to verify</p>
            </div>
          </div>
        )}

        <label className="mt-4 block cursor-pointer bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold">
          {selectedImage ? 'Change Image' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* Verification Section */}
      <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">Verification</h3>
        
        <button
          onClick={verifyImage}
          disabled={!selectedImage || !isConnected || isVerifying}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            !selectedImage || !isConnected || isVerifying
              ? 'bg-blue-300 text-blue-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isVerifying ? 'Verifying...' : 'Verify Image'}
        </button>

        {verificationResult && (
          <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Verification Complete</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>Classification:</strong> {verificationResult.classification}</p>
              <p><strong>Confidence:</strong> {verificationResult.confidence}%</p>
              <p><strong>IPFS Hash:</strong> {verificationResult.ipfsHash}</p>
              <p><strong>Timestamp:</strong> {verificationResult.timestamp}</p>
              <p><strong>Signature:</strong> {verificationResult.signature.slice(0, 20)}...</p>
            </div>
            
            <button
              onClick={mintNFT}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors font-semibold"
            >
              Mint as NFT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationForm;
