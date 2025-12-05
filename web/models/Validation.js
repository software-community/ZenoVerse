import mongoose from 'mongoose';

const validationSchema = new mongoose.Schema({
  imageBase64: {
    type: String,
    required: true,
  },
  imageHash: {
    type: String,
    required: true,
  },
  geolocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  time: {
    type: Date,
    required: true,
  },
  constellation: {
    type: String,
    required: false,
  },
  confidenceScore: {
    type: Number,
    required: false,
  },
  isValid: {
    type: Boolean,
    required: true,
  },
  reason: {
    type: String,
    default: '',
  },
  ipfsMetadataUri: {
    type: String,
    default: '',
  },
  txnHash: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Validation || mongoose.model('Validation', validationSchema);
