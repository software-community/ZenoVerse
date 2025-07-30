import { NextResponse } from 'next/server';
import { classifyImage } from '@/lib/cnnClient';
import { isVisible } from '@/lib/visibilityCheck';
import { compareHashes } from '@/lib/imageHash';
import { uploadMetadataToIPFS } from '@/lib/ipfs';
import { mintObservation } from '@/lib/mintNFT';
import { logValidation } from '@/lib/logValidation';
import { writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic'; // disable edge runtime (needed for fs & formData)

export async function POST(req) {
  const formData = await req.formData();

  const imageFile = formData.get('image');
  const userConstellation = formData.get('constellation');
  const latitude = formData.get('latitude');
  const longitude = formData.get('longitude');
  const timestamp = formData.get('timestamp');
  const userAddress = formData.get('userAddress');

  const logEntry = {
    imageBase64: imageFile ? await imageFile.text() : null,
    imageHash: '', // Placeholder, will be set after image processing
    geolocation: {
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
    },
    time: new Date(timestamp).toISOString(),
    constellation: userConstellation,
    confidenceScore: 0.92, // Placeholder confidence score
    isValid: false,
    reason: '',
    ipfsMetadataUri: '',
    txnHash: '',
  };

  if (!imageFile || !userConstellation || !latitude || !longitude || !timestamp || !userAddress) {
    logEntry.reason = 'Missing required fields';
    await logValidation(logEntry);
    return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 400 });
  }

  try {
    // Save image to temp file
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join('/tmp', `${randomUUID()}.jpg`);
    await writeFile(tempFilePath, buffer);

    // 1. CNN Classification
    const cnnPredictionData = await classifyImage(tempFilePath);
    const cnnPrediction = cnnPredictionData.constellation;
    const cnnConfidence = cnnPredictionData.confidenceScore;
    if (cnnPrediction !== userConstellation) {
      logEntry.reason = 'Constellation mismatch';
      await logValidation(logEntry);
      return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 400 });
    }
    console.log("User Constellation:", userConstellation, "CNN Prediction:", cnnPrediction, "Confidence:", cnnConfidence);

    // 2. Visibility Check
    const visible = await isVisible({
      constellation: userConstellation,
      latitude,
      longitude,
      timestamp,
    });

    if (!visible) {
      logEntry.reason = 'Constellation not visible at that location/time';
      await logValidation(logEntry);
      return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 400 });
    }
    console.log("Visibility Check:", visible);

    // 3. Duplicate Check
    const hashData = await compareHashes(tempFilePath);
    const isDup = hashData.isDuplicate;
    if (isDup) {
      logEntry.reason = 'Duplicate image detected';
      await logValidation(logEntry);
      return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 400 });
    }

    // 4. Upload metadata to IPFS
    const metadata = {
      constellation: userConstellation,
      latitude,
      longitude,
      timestamp,
      confidence: cnnConfidence,
      image: buffer.toString('base64'),
    };

    const tokenURI = await uploadMetadataToIPFS(metadata);
    logEntry.ipfsMetadataUri = tokenURI;

    // 5. Mint NFT
    const tx = await mintObservation(userAddress, tokenURI);
    logEntry.txnHash = tx.hash;
    logEntry.isValid = true;
    // logEntry.imageHash = 

    await logValidation(logEntry);

    return NextResponse.json({
      validated: true,
      txHash: tx.hash,
      tokenURI,
    });
  } catch (error) {
    console.error('Validation or minting error:', error);
    logEntry.reason = 'Internal server error';
    await logValidation(logEntry);
    return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 500 });
  }
}
