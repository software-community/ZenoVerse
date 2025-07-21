import { ethers } from 'ethers';
import ZenoVerseABI from './ZenoVerseABI.json';

const CONTRACT_ADDRESS = process.env.ZENOVERSE_CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;


export async function mintObservation(to, tokenURI) {
  if (!CONTRACT_ADDRESS || !RPC_URL || !PRIVATE_KEY) {
    throw new Error('Missing contract address, RPC URL, or private key in environment variables.');
  }

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ZenoVerseABI, wallet);

  // Only the contract owner can call mintObservation
  const tx = await contract.mintObservation(to, tokenURI);
  await tx.wait();
  return tx;
} 