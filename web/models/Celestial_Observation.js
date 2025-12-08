import mongoose from 'mongoose';

const Celestial_ObservationSchema = new mongoose.Schema({
  mythology: {
    type: String,
    required: false,
  },
  stars: {
    type: Number,
    required: false,
  },
  season: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Celestial_Observation || mongoose.model('Celestial_Observation', Celestial_ObservationSchema);
