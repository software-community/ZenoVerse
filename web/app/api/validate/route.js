import { NextResponse } from 'next/server';
// import { classifyImage } from '@/lib/cnnClient';
// import { isVisible } from '@/lib/visibilityCheck';
import { generateImageHash, compareHashes, checkImageHash } from '@/lib/imageHash';
// import { uploadMetadataToIPFS } from '@/lib/ipfs';
// import { mintObservation } from '@/lib/mintNFT';
// import { logValidation } from '@/lib/logValidation';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic'; // disable edge runtime (needed for fs & formData)

export async function POST(req) {
  console.log('🚀 API route called');
  
  try {
    console.log('1️⃣ Getting form data...');
    const formData = await req.formData();
    console.log('📝 FormData received');

    console.log('2️⃣ Extracting image file...');
    const imageFile = formData.get('image');
    console.log('📷 Image file:', imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'No image');
    
    if (!imageFile) {
      console.log('❌ No image file provided');
      return NextResponse.json({ 
        validated: false, 
        reason: 'No image file provided' 
      }, { status: 400 });
    }

    // Extract other parameters (for future features)
    const userConstellation = formData.get('constellation');
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const timestamp = formData.get('timestamp');
    const userAddress = formData.get('userAddress');

    // Log entry for validation tracking (if logValidation is available)
    const logEntry = {
      imageBase64: null, // Will be set if needed
      imageHash: '', // Will be set after duplicate check
      geolocation: latitude && longitude ? {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      } : null,
      time: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
      constellation: userConstellation || null,
      confidenceScore: 0, // Will be set by CNN if available
      isValid: false,
      reason: '',
      ipfsMetadataUri: '',
      txnHash: '',
    };

    console.log('3️⃣ Processing image...');
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    console.log('4️⃣ Creating temp directory...');
    // Create temp directory if it doesn't exist
    const tempDir = process.env.TEMP || 'C:\\temp';
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }
    
    console.log('5️⃣ Writing file...');
    const tempFilePath = path.join(tempDir, `${randomUUID()}.jpg`);
    await writeFile(tempFilePath, buffer);
    console.log('📁 Saved image to:', tempFilePath);

    // 1. CNN Classification (if available and constellation is provided)
    if (userConstellation) {
      try {
        // Uncomment when CNN is ready
        // const cnnPredictionData = await classifyImage(tempFilePath);
        // const cnnPrediction = cnnPredictionData.constellation;
        // const cnnConfidence = cnnPredictionData.confidenceScore;
        // logEntry.confidenceScore = cnnConfidence;
        
        // if (cnnPrediction !== userConstellation) {
        //   logEntry.reason = 'Constellation mismatch';
        //   console.log('❌ CNN Classification failed: Constellation mismatch');
        //   // await logValidation(logEntry); // Uncomment when available
        //   return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 400 });
        // }
        // console.log("✅ CNN Classification passed:", { userConstellation, cnnPrediction, cnnConfidence });
        console.log("⏭️ CNN Classification skipped (not implemented yet)");
      } catch (error) {
        console.log("⚠️ CNN Classification unavailable:", error.message);
      }
    }

    // 2. Visibility Check (if location and time are provided)
    if (userConstellation && latitude && longitude && timestamp) {
      try {
        // Uncomment when visibility check is ready
        // const visible = await isVisible({
        //   constellation: userConstellation,
        //   latitude,
        //   longitude,
        //   timestamp,
        // });
        
        // if (!visible) {
        //   logEntry.reason = 'Constellation not visible at that location/time';
        //   console.log('❌ Visibility check failed');
        //   // await logValidation(logEntry); // Uncomment when available
        //   return NextResponse.json({ validated: false, reason: logEntry.reason }, { status: 400 });
        // }
        // console.log("✅ Visibility check passed");
        console.log("⏭️ Visibility check skipped (not implemented yet)");
      } catch (error) {
        console.log("⚠️ Visibility check unavailable:", error.message);
      }
    }

    // 3. Duplicate Check (CURRENT WORKING FEATURE)
    console.log('6️⃣ Starting duplicate check...');
    console.log('🔍 Checking for duplicate image...');
    const duplicateResult = await checkImageHash(tempFilePath);
    console.log('7️⃣ Duplicate check completed:', duplicateResult);
    
    // Set hash in log entry
    logEntry.imageHash = duplicateResult.hash;
    
    if (duplicateResult.isDuplicate) {
      logEntry.reason = 'Duplicate image detected';
      console.log('❌ Duplicate image detected, rejecting submission');
      
      // Log the failure if logging is available
      try {
        // await logValidation(logEntry); // Uncomment when available
      } catch (logError) {
        console.log("⚠️ Logging unavailable:", logError.message);
      }
      
      return NextResponse.json({ 
        validated: false, 
        reason: logEntry.reason,
        matchedHash: duplicateResult.matchedHash 
      }, { status: 400 });
    }
    
    console.log('✅ Image is unique, proceeding with validation');

    // 4. Upload metadata to IPFS (if user address is provided for minting)
    let tokenURI = null;
    if (userAddress) {
      try {
        // Uncomment when IPFS is ready
        // const metadata = {
        //   constellation: userConstellation,
        //   latitude,
        //   longitude,
        //   timestamp,
        //   confidence: logEntry.confidenceScore,
        //   image: buffer.toString('base64'),
        // };
        // tokenURI = await uploadMetadataToIPFS(metadata);
        // logEntry.ipfsMetadataUri = tokenURI;
        // console.log("✅ Metadata uploaded to IPFS:", tokenURI);
        console.log("⏭️ IPFS upload skipped (not implemented yet)");
      } catch (error) {
        console.log("⚠️ IPFS upload unavailable:", error.message);
      }
    }

    // 5. Mint NFT (if token URI and user address are available)
    let txHash = null;
    if (userAddress && tokenURI) {
      try {
        // Uncomment when minting is ready
        // const tx = await mintObservation(userAddress, tokenURI);
        // txHash = tx.hash;
        // logEntry.txnHash = txHash;
        // console.log("✅ NFT minted:", txHash);
        console.log("⏭️ NFT minting skipped (not implemented yet)");
      } catch (error) {
        console.log("⚠️ NFT minting unavailable:", error.message);
      }
    }

    // Mark as valid and log success
    logEntry.isValid = true;
    logEntry.reason = 'Successfully validated';
    
    try {
      // await logValidation(logEntry); // Uncomment when available
    } catch (logError) {
      console.log("⚠️ Logging unavailable:", logError.message);
    }

    console.log('8️⃣ Returning success response...');
    
    // Return response compatible with both current and future versions
    const response = {
      validated: true,
      message: duplicateResult.mongoEnabled ? 
        'Image successfully validated and stored in MongoDB' : 
        'Image validated (MongoDB unavailable)',
      imageHash: duplicateResult.hash,
      mongoEnabled: duplicateResult.mongoEnabled || false,
      savedId: duplicateResult.savedId || null,
      warning: duplicateResult.warning || null,
      timestamp: new Date().toISOString()
    };

    // Add future features to response if they were processed
    if (txHash) response.txHash = txHash;
    if (tokenURI) response.tokenURI = tokenURI;
    if (logEntry.confidenceScore > 0) response.confidenceScore = logEntry.confidenceScore;

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Validation error:', error);
    
    // Try to log the error if logging is available
    try {
      // const errorLogEntry = {
      //   imageHash: '',
      //   isValid: false,
      //   reason: 'Internal server error: ' + error.message,
      //   time: new Date().toISOString()
      // };
      // await logValidation(errorLogEntry); // Uncomment when available
    } catch (logError) {
      console.log("⚠️ Error logging unavailable:", logError.message);
    }
    
    return NextResponse.json({ 
      validated: false, 
      reason: 'Internal server error',
      error: error.message 
    }, { status: 500 });
  }
}
