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
    <>
      {account ? (
        <button
          onClick={switchAccount}
          className="ml-4 px-8 py-3 border-2 border-[#7407b8] rounded-full bg-[#428cff] text-white text-lg font-orbitron tracking-wider shadow-[0_0_20px_#428cff,0_0_6px_#fff2] transition-all duration-200 relative overflow-hidden hover:bg-[#2566c1] hover:border-white hover:shadow-[0_0_28px_#428cff,0_0_10px_#fff4]"
        >
          {truncateAccount(account)} (Switch)
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="ml-4 px-8 py-3 border-2 border-[#7407b8] rounded-full bg-[#428cff] text-white text-lg font-orbitron tracking-wider shadow-[0_0_20px_#428cff,0_0_6px_#fff2] transition-all duration-200 relative overflow-hidden hover:bg-[#2566c1] hover:border-white hover:shadow-[0_0_28px_#428cff,0_0_10px_#fff4]"
        >
          Connect Wallet
        </button>
      )}
    </>
  );
}

export default ConnectWalletButton;
