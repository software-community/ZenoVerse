"use client";
import { accountContext } from "@/context/accountContext";
import Navbar from "@/components/Navbar";
import { useContext, useEffect, useState } from "react";
import Landing from "@/components/Landing";

export default function Home() {
  // Get wallet and contract state from context
  const { account, setAccount, contract, setContract } =
    useContext(accountContext);
  const [loading, setLoading] = useState(true);

  // Check if MetaMask is installed
  useEffect(() => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this app.");
      return;
    }
  }, []);
  // Auto-connect to previously connected wallet on page load
  useEffect(() => {
    const autoConnect = async () => {
      setLoading(true);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          // Initialize contract instance when needed
          // const contractInstance = await initialize_contract();
          // setContract(contractInstance);
        }
      }
      setLoading(false);
    };
    autoConnect();
  }, []);

  // Listen for account changes in MetaMask
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0] || null);
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      
      // Cleanup listener on component unmount
      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, []);

  if(loading)
    return <div>Loading ...</div>
  
  return (
    <>
      <Landing />
    </>
  );
}
