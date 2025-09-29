"use client";
import { createContext, useState, useEffect } from "react";
import { initialize_contract } from "../lib/contractActions";
import { getUserNFTMetadata } from "../lib/contractActions";

// Create a context to manage wallet and contract state globally
export const accountContext = createContext();

export const AccountProvider = ({ children }) => {
  const demoNfts = [
    {
      tokenId: "001",
      chain: "Ethereum",
      price: "2.15 ETH",
      metadata: {
        name: "Celestial Dragon",
        image:
          "https://ipfs.io/ipfs/QmXoYJk34abcd1234efgh5678ijklmno/CelestialDragon.png",
        confidence: 0.92,
      },
    },
    {
      tokenId: "002",
      chain: "Polygon",
      price: "750 MATIC",
      metadata: {
        name: "Cyber Samurai",
        image:
          "https://images.unsplash.com/photo-1622495892875-d9f2dfc8dbb7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        confidence: 0.87,
      },
    },
    {
      tokenId: "003",
      chain: "Ethereum",
      price: "0.89 ETH",
      metadata: {
        name: "Pixel Alien",
        image:
          "https://ipfs.io/ipfs/QmYhR9x41xpix3abcd5678Alien/PixelAlien.png",
        confidence: 0.76,
      },
    },
    {
      tokenId: "004",
      chain: "Solana",
      price: "45 SOL",
      metadata: {
        name: "Neon Panther",
        image:
          "https://images.unsplash.com/photo-1612831455542-6370e8e8c0d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        confidence: 0.81,
      },
    },
    {
      tokenId: "005",
      chain: "Ethereum",
      price: "5.00 ETH",
      metadata: {
        name: "Astral Goddess",
        image: "https://ipfs.io/ipfs/Qmbcdef1234567AstralGoddess.png",
        confidence: 0.95,
      },
    },
  ];

  // State for connected wallet address
  const [account, setAccount] = useState(null);
  // State for smart contract instance
  const [contract, setContract] = useState(null);

  // State for NFTs
  const [NFTs, setNFTs] = useState([]);

  // Fetch NFTs when account changes
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account || !contract) {
        return;
      }
      const nfts = await getUserNFTMetadata(account, contract);
      setNFTs(nfts);
    };
    fetchNFTs();
  }, [account, contract]);

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
