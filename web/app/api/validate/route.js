import { NextResponse } from "next/server";
import os from "os";
import { classifyImage } from "@/lib/cnnClient";
import { isVisible } from "@/lib/visibilityCheck";
import { checkImageHash } from "@/lib/imageHash"; // ✅ updated import
import { uploadMetadataToIPFS } from "@/lib/ipfs";
import { mintObservation } from "@/lib/mintNFT";
import { logValidation } from "@/lib/logValidation";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic"; // disable edge runtime (needed for fs & formData)

export async function POST(req) {
  const formData = await req.formData();

  const imageFile = formData.get("image");
  const userConstellation = formData.get("constellation");
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");
  const timestamp = formData.get("timestamp");
  const userAddress = formData.get("userAddress");

  const logEntry = {
    imageBase64: imageFile ? await imageFile.text() : null,
    imageHash: "", // will be filled after processing
    geolocation: {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    },
    time: new Date(timestamp).toISOString(),
    constellation: "",
    confidenceScore: 0.92, // default placeholder
    isValid: false,
    reason: "",
    ipfsMetadataUri: "",
    txnHash: "",
  };

  if (
    !imageFile ||
    !userConstellation ||
    !latitude ||
    !longitude ||
    !timestamp ||
    !userAddress
  ) {
    logEntry.reason = "Missing required fields";
    console.warn("Validation failed: Missing required fields", logEntry);
    await logValidation(logEntry);
    return NextResponse.json(
      { validated: false, reason: logEntry.reason },
      { status: 400 }
    );
  }

  let tempFilePath = "";
  try {
    // Save image to temp file
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempDir = os.tmpdir();
    tempFilePath = path.join(tempDir, `${randomUUID()}.jpg`);
    await writeFile(tempFilePath, buffer);

    // 3. Hash Generation + Duplicate Check + Save
    const hashResult = await checkImageHash(tempFilePath);
    logEntry.imageHash = hashResult.hash;

    if (hashResult.isDuplicate) {
      logEntry.reason = "Duplicate image detected";
      console.warn("Validation failed: Duplicate image", logEntry);
      await logValidation(logEntry);
      return NextResponse.json(
        { validated: false, reason: logEntry.reason },
        { status: 400 }
      );
    }
    // 1. CNN Classification
    const cnnPredictionData = await classifyImage(tempFilePath);
    const cnnPrediction = cnnPredictionData.constellation;
    const cnnConfidence = cnnPredictionData.confidenceScore;

    logEntry.constellation = cnnPrediction;
    logEntry.confidenceScore = cnnConfidence;

    // if confidence < threshold of 70%, reject
    if (cnnConfidence < 0.7) {
      logEntry.reason = "No constellation or low confidence: " + cnnConfidence;
      console.warn("Validation failed: Low confidence score:", cnnConfidence);
      await logValidation(logEntry);
      return NextResponse.json(
        { validated: false, reason: logEntry.reason },
        { status: 400 }
      );
    }

    if (cnnPrediction.toLowerCase() !== userConstellation.toLowerCase()) {
      logEntry.reason = "Constellation mismatch. User claim: " + userConstellation + ", CNN prediction: " + cnnPrediction;
      console.warn("Validation failed: Constellation mismatch. User claim: ", userConstellation, " CNN prediction: ", cnnPrediction, logEntry);
      await logValidation(logEntry);
      return NextResponse.json(
        { validated: false, reason: logEntry.reason },
        { status: 400 }
      );
    }

    // 2. Visibility Check
    const visible = await isVisible({
      constellation: userConstellation,
      latitude,
      longitude,
      timestamp,
    });

    if (!visible) {
      logEntry.reason = "Constellation not visible at that location/time";
      console.warn("Validation failed: Constellation not visible at timestamp:", timestamp);
      await logValidation(logEntry);
      return NextResponse.json(
        { validated: false, reason: logEntry.reason },
        { status: 400 }
      );
    }

    // 4. Upload metadata to IPFS
    const metadata = {
      name: userConstellation,
      description: `A beautiful representation of the ${userConstellation} constellation.`,
      constellation: userConstellation,
      latitude,
      longitude,
      timestamp,
      confidence: cnnConfidence,
      image: `data:image/jpeg;base64,${buffer.toString("base64")}`,
    };

    const tokenURI = await uploadMetadataToIPFS(metadata);
    logEntry.ipfsMetadataUri = tokenURI;

    // 5. Mint NFT
    const tx = await mintObservation(userAddress, tokenURI);
    logEntry.txnHash = tx.hash;
    logEntry.isValid = true;

    await logValidation(logEntry);

    return NextResponse.json({
      validated: true,
      txHash: tx.hash,
      tokenURI,
    });
  } catch (error) {
    console.error("Validation or minting error:", error);
    logEntry.reason = "Internal server error";
    await logValidation(logEntry);
    return NextResponse.json(
      { validated: false, reason: logEntry.reason },
      { status: 500 }
    );
  } finally {
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (cleanupErr) {
        console.warn("Failed to delete temp file:", cleanupErr.message);
      }
    }
  }
}