const mongoose = require('mongoose');

const chargingStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true,
    maxlength: [100, 'Station name cannot be more than 100 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: [true, 'Location coordinates are required'],
      validate: {
        validator: function(coordinates) {
          return coordinates.length === 2 && 
                 coordinates[0] >= -180 && coordinates[0] <= 180 && // longitude
                 coordinates[1] >= -90 && coordinates[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates. Longitude must be between -180 and 180, latitude between -90 and 90'
      }
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
      maxlength: [200, 'Address cannot be more than 200 characters']
    }
  },
  status: {
    type: String,
    enum: {
      values: ['Active', 'Inactive', 'Maintenance'],
      message: 'Status must be either Active, Inactive, or Maintenance'
    },
    default: 'Active'
  },
  powerOutput: {
    type: Number,
    required: [true, 'Power output is required'],
    min: [1, 'Power output must be at least 1 kW'],
    max: [1000, 'Power output cannot exceed 1000 kW']
  },
  connectorType: {
    type: String,
    enum: {
      values: ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'],
      message: 'Connector type must be one of: Type 1, Type 2, CCS, CHAdeMO, Tesla'
    },
    required: [true, 'Connector type is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  pricePerKWh: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create 2dsphere index for geospatial queries
chargingStationSchema.index({ location: '2dsphere' });

// Index for better performance on common queries
chargingStationSchema.index({ status: 1 });
chargingStationSchema.index({ connectorType: 1 });
chargingStationSchema.index({ powerOutput: 1 });
chargingStationSchema.index({ createdBy: 1 });

// Virtual for formatted location
chargingStationSchema.virtual('formattedLocation').get(function() {
  if (this.location && this.location.coordinates) {
    return {
      latitude: this.location.coordinates[1],
      longitude: this.location.coordinates[0]
    };
  }
  return null;
});

// Static method to find stations within a certain distance
chargingStationSchema.statics.findNearby = function(longitude, latitude, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance // in meters
      }
    }
  });
};

module.exports = mongoose.model('ChargingStation', chargingStationSchema);
