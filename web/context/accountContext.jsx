"use client";
import { createContext, useState, useEffect } from "react";
import { initialize_contract } from "../lib/contractActions";
import { getUserNFTMetadata } from "../lib/contractActions";

// Create a context to manage wallet and contract state globally
export const accountContext = createContext();

export const AccountProvider = ({ children }) => {
  // State for connected wallet address
  const [account, setAccount] = useState(null);
  // State for smart contract instance
  const [contract, setContract] = useState(null);

  // Static NFT data for demonstration purposes
  const staticNFTs = [
    {
      name: "Iron Ape",
      image: "/ironman.jpg",
      tokenId: "1001",
      price: "2.1 ETH",
      chain: "Ethereum",
      confidence: 0.92,
      description: "A rare cybernetic primate.",
      lat: 37.7749,
      long: -122.4194,
      timestamp: "2025-01-05T10:15:00Z",
    },
    {
      name: "Golden Cat",
      image: "/profile.webp",
      tokenId: "1002",
      price: "0.8 ETH",
      chain: "Ethereum",
      confidence: 0.81,
      description: "A shimmering feline with golden fur.",
      lat: 34.0522,
      long: -118.2437,
      timestamp: "2025-01-05T11:20:00Z",
    },
    {
      name: "Cyber Fox",
      image: "/profile2.jpg",
      tokenId: "1003",
      price: "0.3 ETH",
      chain: "Polygon",
      confidence: 0.75,
      description: "A stealthy fox from the neon net.",
      lat: 51.5074,
      long: -0.1278,
      timestamp: "2025-01-05T12:05:00Z",
    },
    {
      name: "Steel Hero",
      image: "/spiderman.png",
      tokenId: "1004",
      price: "5.0 ETH",
      chain: "Ethereum",
      confidence: 0.97,
      description: "Armored savior of the multiverse.",
      lat: 40.7128,
      long: -74.006,
      timestamp: "2025-01-05T12:55:00Z",
    },
    {
      name: "Pixel Punk",
      image: "/thumb2.jpg",
      tokenId: "1005",
      price: "1.2 ETH",
      chain: "Polygon",
      confidence: 0.68,
      description: "Retro rebel from an 8-bit realm.",
      lat: 48.8566,
      long: 2.3522,
      timestamp: "2025-01-05T13:30:00Z",
    },
    {
      name: "Mystic Wolf",
      image: "/ironman.jpg",
      tokenId: "1006",
      price: "0.1 ETH",
      chain: "Polygon",
      confidence: 0.73,
      description: "Lunar howler with arcane markings.",
      lat: 35.6895,
      long: 139.6917,
      timestamp: "2025-01-05T14:10:00Z",
    },
    {
      name: "Shadow Ninja",
      image: "/spiderman.png",
      tokenId: "1007",
      price: "0.5 ETH",
      chain: "Ethereum",
      confidence: 0.84,
      description: "Silent guardian of the hidden paths.",
      lat: 52.52,
      long: 13.405,
      timestamp: "2025-01-05T14:45:00Z",
    },
    {
      name: "Mecha Titan",
      image: "/profile.webp",
      tokenId: "1008",
      price: "7.8 ETH",
      chain: "Ethereum",
      confidence: 0.99,
      description: "Colossal mech forged in starlight.",
      lat: -33.8688,
      long: 151.2093,
      timestamp: "2025-01-05T15:20:00Z",
    },
    {
      name: "Steel",
      image: "/thumb2.jpg",
      tokenId: "1034",
      price: "5.0 ETH",
      chain: "Ethereum",
      confidence: 0.9,
      description: "Tempered alloy of might and will.",
      lat: 41.9028,
      long: 12.4964,
      timestamp: "2025-01-05T16:02:00Z",
    },
  ];

  // State for NFTs
  const [NFTs, setNFTs] = useState(staticNFTs);

  // Fetch NFTs when account changes
  useEffect(() => {
    const fetchNFTs = async () => {
      const nfts = await getUserNFTMetadata();
      setNFTs(nfts);
    };
    fetchNFTs();
  }, [account]);

  // Log whenever the connected account changes
  useEffect(() => {
    console.log("Connected account:", account);
  }, [account]);

  // Initialize contract on mount
  useEffect(() => {
    const autoConnect = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const contractInstance = await initialize_contract();
          console.log("Contract initialized:", contractInstance);
          setContract(contractInstance);
        }
      } else {
        alert("Please install MetaMask to use this app.");
      }
    };
    autoConnect();
  }, []);

  // Values to be provided to all child components
  const value = {
    account,
    setAccount,
    contract,
    setContract,
    NFTs,
    setNFTs,
  };
  return (
    <accountContext.Provider value={value}>{children}</accountContext.Provider>
  );
};
