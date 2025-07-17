import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  imageHash: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Image || mongoose.model('Image', imageSchema);
