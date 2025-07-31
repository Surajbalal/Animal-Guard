const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
  type: {
    type: String,
    default: 'Point',
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(coords) {
        return coords.length === 2 && 
               coords[0] >= -180 && coords[0] <= 180 && 
               coords[1] >= -90 && coords[1] <= 90;
      },
      message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90.'
    }
  }
});

const addressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
});

const ngoSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'NGO name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  contactPhone: { 
    type: String, 
    required: [true, 'Contact phone is required'],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters long']
  },
  rescueCategories: { 
    type: [String],
    required: [true, 'At least one rescue category is required'],
    enum: ['Dogs', 'Cats', 'Farm Animals', 'Wildlife', 'Birds', 'Reptiles', 'All Animals']
  },
  rescueDistance: { 
    type: Number, 
    required: [true, 'Rescue distance is required'],
    enum: [5, 10, 15, 20, 30, 50]
  },
  serviceHours: { 
    type: String,
    trim: true
  },
  registrationNumber: { 
    type: String,
    trim: true
  },
  address: {
    type: addressSchema,
    required: true
  },
  location: {
    type: locationSchema,
    required: true,
    index: '2dsphere'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for location field for geospatial queries
ngoSchema.index({ location: '2dsphere' });

// Update the updatedAt field before saving
ngoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('NGO', ngoSchema);