import React, { useContext } from "react";
import { accountContext } from "@/context/accountContext";

function ConnectWalletButton() {
  // Get account state and setter from context
  const { account, setAccount } = useContext(accountContext);

  // Handle initial wallet connection
  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        alert("Please install MetaMask to use this app.");
        return;
      }

      // Request access to user's MetaMask accounts
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Validate that we got at least one account
      if (accounts.length === 0) {
        console.log("No accounts found");
        return;
      }
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Open MetaMask account selector for switching accounts
  const switchAccount = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
    } catch (error) {
      console.error("Error switching accounts:", error);
    }
  };

  // Format account address for display (0x1234...5678)
  const truncateAccount = (account) => {
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  return (
    <div className="flex gap-2 items-center">
      {account ? (
        <>
          <span className="font-mono bg-gray-100 px-3 py-1 rounded">
            Connected to: {truncateAccount(account)}
          </span>
          <button
            onClick={switchAccount}
            className="bg-[#7407b8b9] hover:bg-[#7407b8] text-white px-4 py-1 rounded transition-colors"
          > 
            Switch
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-[#7407b8b9] hover:bg-[#7407b8] text-white px-4 py-1 rounded transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default ConnectWalletButton;
