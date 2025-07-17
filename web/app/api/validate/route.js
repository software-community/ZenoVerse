import { NextResponse } from 'next/server';
import { classifyImage } from '@/lib/cnnClient';
import { isVisible } from '@/lib/visibilityCheck';
import { isDuplicate } from '@/lib/imageHash';
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
    userAddress,
    userConstellation,
    latitude,
    longitude,
    timestamp,
    validated: false,
    reason: null,
    tokenURI: null,
    txHash: null,
    createdAt: new Date(),
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
    const cnnPrediction = await classifyImage(tempFilePath);
    if (cnnPrediction !== userConstellation) {
      logEntry.reason = 'Constellation mismatch';
      await logValidation(logEntry);
      return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 400 });
    }

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

    // 3. Duplicate Check
    const isDup = await isDuplicate(tempFilePath);
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
      confidence: 0.92, // placeholder
      image: buffer.toString('base64'),
    };

    const tokenURI = await uploadMetadataToIPFS(metadata);
    logEntry.tokenURI = tokenURI;

    // 5. Mint NFT
    const tx = await mintObservation(userAddress, tokenURI);
    logEntry.txHash = tx.hash;
    logEntry.validated = true;

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
