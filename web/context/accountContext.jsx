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

  const [loading, setLoading] = useState(false);

  const [isInitialLoad, setIsInitialLoad] = useState(true);


  // State for NFTs
  const [NFTs, setNFTs] = useState([]);

  // Fetch NFTs when account changes
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account || !contract) {
        return;
      }
      setLoading(true);
      const nfts = await getUserNFTMetadata(account, contract);
      setNFTs(nfts);
      setLoading(false);
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
    loading,
    setLoading,
  };
  return (
    <accountContext.Provider value={value}>{children}</accountContext.Provider>
  );
};
