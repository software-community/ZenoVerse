import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Validation from '../models/Validation.js';
import connectMongoDB from '../database/mongo.js';

dotenv.config();

let isConnected = false;

async function ensureMongoConnected() {
  if (!isConnected) {
    await connectMongoDB();
    isConnected = true;
  }
}

export async function logValidation(data) {
  try {
    await ensureMongoConnected();

    const validation = new Validation(data);
    await validation.save();

    console.log('Validation logged to MongoDB');
  } catch (error) {
    console.error('Failed to log validation:', error.message);
  }
}
