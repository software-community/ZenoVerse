import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function uploadMetadataToIPFS(metadata) {
  try {
    const requiredFields = ["constellation", "latitude", "longitude", "timestamp", "confidence", "image"];
    for (const field of requiredFields) {
      if (!(field in metadata)) {
        throw new Error(`Missing required metadata field: ${field}`);
      }
    }

    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await axios.post(url, metadata, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
      },
    });

    const ipfsHash = response.data.IpfsHash;
    // console.log(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error.message);
    throw new Error("IPFS metadata upload failed");
  }
}