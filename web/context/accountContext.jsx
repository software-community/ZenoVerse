"use client";
import { createContext, useState, useEffect } from "react";

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
    
    // Values to be provided to all child components
    const value = {
        account, setAccount, contract, setContract
    }
    return (
        <accountContext.Provider value={value}>{children}</accountContext.Provider>
    );
};