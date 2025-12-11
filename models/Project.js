const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Living Room', 'Bedroom', 'Kitchen', 'Full Home']
  },
  style: {
    type: String,
    required: true,
    enum: ['Contemporary', 'Modern', 'Traditional', 'Minimalist']
  },
  layout: {
    type: String,
    required: true,
    enum: ['Parallel', 'L-Shaped', 'U-Shaped', 'Island', 'Straight']
  },
  location: {
    type: String,
    required: true
  },
  pricing: {
    type: String,
    required: true,
    enum: ['10-20', '20-30', '30+', '40+', '50+']
  },
  bhk: {
    type: String,
    required: true,
    enum: ['1-BHK', '2-BHK', '3-BHK', '4-BHK', '5-BHK']
  },
  scope: {
    type: String,
    required: true
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['Apartment', 'Villa', 'Independent House', 'Duplex']
  },
  size: {
    type: String,
    required: true,
    enum: ['500 to 1000 sq ft', '1000 to 2500 sq ft', '2500 to 5000 sq ft', '5000+ sq ft']
  },
  status: {
    type: String,
    required: true,
    enum: ['delivered', 'upcoming'],
    default: 'delivered'
  },
  priceMin: {
    type: Number,
    required: true
  },
  priceMax: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  originalSize: Number,
  compressedSize: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);