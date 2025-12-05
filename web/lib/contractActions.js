import { ethers, BrowserProvider, Contract } from 'ethers';
import ZenoVerseABI from './ZenoVerseABI.json';
import { useContext } from 'react';
import { accountContext } from '../context/accountContext';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ZENOVERSE_CONTRACT_ADDRESS;

let contract;
let provider;
let signer;

export const initialize_contract = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("Ethereum provider not available");
    }

    provider = new BrowserProvider(window.ethereum);
    signer = await provider.getSigner();

    if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address not defined in environment variables");
    }

    let contract = new Contract(CONTRACT_ADDRESS, ZenoVerseABI, signer);
    return contract;
};

// Get all token IDs owned by the user
export async function getUserOwnedTokenIds() {

  const { account, setAccount, contract, setContract } = useContext(accountContext);

  if (!account || !contract) {
    console.error('No account or contract available');
    return [];
  }
  
  try {
    console.log("contract: ", contract)
    const tokenIds = await contract.getAllTokensByOwner(account);
    // Convert BigNumber[] to number[]
    return tokenIds.map(id => id.toNumber());
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
};

export async function getUserNFTMetadata(account, contract) {
  if (!account || !contract) {
    return; 
  }

  console.log("contract: ", contract)
  console.log(await provider.getNetwork());
  const code = await provider.getCode(contract.target);
  console.log("bytecode:", code);


  try {
    // 1. Get token IDs owned by user
    const tokenIds = await contract.getAllTokensByOwner(account);
    console.log("User Token IDs:", tokenIds); 

    // 2. Fetch metadata for each token
    const metadataPromises = tokenIds.map(async (tokenId) => {
      const tokenURI = await contract.tokenURI(tokenId);
      
      // If it's an IPFS URI, convert it to a gateway link
      let url = tokenURI.startsWith("ipfs://")
        ? tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        : tokenURI;
      
      // If pinata, replace to ipfs:
      if (url.startsWith("https://gateway.pinata.cloud/ipfs/")) {
        url = url.replace("https://gateway.pinata.cloud/ipfs/", "https://ipfs.io/ipfs/");
      }

      const res = await fetch(url);
      const metadata = await res.json();
      console.log("Fetched metadata for token ID:", tokenId, metadata);

      return {
        tokenId: tokenId.toString(),
        tokenURI,
        metadata
      };
    });

    const allMetadata = await Promise.all(metadataPromises);
    return allMetadata;
  } catch (err) {
    console.error("Error fetching user NFTs:", err);
    return [];
  }
};