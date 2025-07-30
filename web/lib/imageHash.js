
import Image from '../models/Image.js';
import connectMongoDB from '../database/mongo.js';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Inline Hamming distance function for hex strings
function calculateHammingDistance(a, b) {
  if (a.length !== b.length) {
    return 100; // Return high distance for different length hashes
  }
  
  let dist = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      dist++;
    }
  }
  
  return dist;
}

async function generateImageHash(imagePath) {
  try {
    console.log('🔢 Generating hash for image:', imagePath);
    console.log('📄 Reading file:', imagePath);
    
    const buffer = fs.readFileSync(imagePath);
    const hash = crypto.createHash('md5').update(buffer).digest('hex');
    console.log('🔢 Generated simple hash:', hash);
    return hash;
  } catch (error) {
    console.error('❌ Hash generation failed:', error.message);
    throw new Error(`Failed to generate hash: ${error.message}`);
  }
}

async function compareHashes(pHash, threshold = 5) {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectMongoDB();
    console.log('✅ Connected to MongoDB');
    
    const allHashes = await Image.find({}, { imageHash: 1 });
    console.log(`📊 Found ${allHashes.length} existing hashes in database`);

    for (const entry of allHashes) {
      const dbHash = entry.imageHash;
      const distance = calculateHammingDistance(pHash, dbHash);

      if (distance <= threshold) {
        console.log(`🎯 Match found! Distance: ${distance}, Threshold: ${threshold}`);
        return { isDuplicate: true, matchedHash: dbHash };
      }
    }

    console.log('✅ No duplicates found');
    return { isDuplicate: false };
  } catch (error) {
    console.error('❌ Error in compareHashes:', error);
    // Don't throw, return false to allow processing to continue
    console.log('⚠️ Database error, assuming no duplicates');
    return { isDuplicate: false, error: error.message };
  }
}

async function checkImageHash(imagePath) {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await connectMongoDB();
    console.log('✅ Connected to MongoDB');
    
    console.log('🔍 Generating hash for image:', imagePath);
    const hash = await generateImageHash(imagePath);
    console.log('✅ Generated hash:', hash);
    
    console.log('🔎 Checking for duplicates...');
    const { isDuplicate, matchedHash, error } = await compareHashes(hash);

    if (isDuplicate) {
      console.log('❌ Duplicate found! Matched hash:', matchedHash);
      return { hash, isDuplicate: true, matchedHash };
    }

    // Store new hash in database
    console.log('💾 Saving new hash to MongoDB...');
    try {
      const newEntry = new Image({ imageHash: hash });
      const savedEntry = await newEntry.save();
      console.log('✅ Successfully saved to MongoDB with ID:', savedEntry._id);

      return { hash, isDuplicate: false, savedId: savedEntry._id, mongoEnabled: true };
    } catch (saveError) {
      console.error('❌ Failed to save to MongoDB:', saveError.message);
      // Return success but indicate database issue
      return { 
        hash, 
        isDuplicate: false, 
        mongoEnabled: false, 
        warning: 'Hash generated but not saved to database',
        error: saveError.message 
      };
    }
  } catch (error) {
    console.error('❌ Error in checkImageHash:', error);
    throw new Error(`Failed to check image hash: ${error.message}`);
  }
}

// Alternative function that works with buffers
async function checkImageBuffer(buffer, filename = 'temp.jpg') {
  try {
    const tempPath = path.join('/tmp', filename);
    await writeFile(tempPath, buffer);
    
    const result = await checkImageHash(tempPath);
    
    // Clean up temp file
    try {
      await unlink(tempPath);
    } catch (e) {
      // Ignore cleanup errors
    }
    
    return result;
  } catch (error) {
    throw new Error(`Failed to check image buffer: ${error.message}`);
  }
}

// Test function to verify database operations
async function testDatabaseConnection() {
  try {
    console.log('🧪 Testing database connection and operations...');
    
    await connectMongoDB();
    console.log('✅ Connected to MongoDB successfully');
    
    // Count existing records
    const count = await Image.countDocuments();
    console.log(`📊 Current number of images in database: ${count}`);
    
    // Get all records
    const allImages = await Image.find({}).limit(5);
    console.log('📋 First 5 records:');
    allImages.forEach((img, index) => {
      console.log(`  ${index + 1}. ID: ${img._id}, Hash: ${img.imageHash.substring(0, 16)}..., Created: ${img.createdAt}`);
    });
    
    return { success: true, count, records: allImages };
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return { success: false, error: error.message };
  }
}

export { generateImageHash, compareHashes, checkImageHash, checkImageBuffer, testDatabaseConnection };