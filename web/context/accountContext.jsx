"use client";
import { createContext, useState, useEffect } from "react";
import { initialize_contract } from "../lib/contractActions";

// Create a context to manage wallet and contract state globally
export const accountContext = createContext();

export const AccountProvider = ({ children }) => {
    // State for connected wallet address
    const [account, setAccount] = useState(null);
    // State for smart contract instance
    const [contract, setContract] = useState(null);

    // Log whenever the connected account changes
    useEffect(() => {
        console.log("Connected account:", account);
    }, [account])

    // Initialize contract on mount
    useEffect(() => {
        const autoConnect = async () => {
            if (typeof window !== "undefined" && window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                setAccount(accounts[0]);
                const contractInstance = await initialize_contract();
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
        account, setAccount, contract, setContract
    }
    return (
        <accountContext.Provider value={value}>{children}</accountContext.Provider>
    );
};