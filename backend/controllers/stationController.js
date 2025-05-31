const ChargingStation = require('../models/ChargingStation');
const { sendSuccess, sendError, sendPaginatedResponse } = require('../utils/response');

// @desc    Get all charging stations with filtering and pagination
// @route   GET /api/stations
// @access  Private
const getStations = async (req, res) => {
  try {
    const {
      status,
      connectorType,
      minPower,
      maxPower,
      search,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by connector type
    if (connectorType) {
      query.connectorType = connectorType;
    }

    // Filter by power output range
    if (minPower || maxPower) {
      query.powerOutput = {};
      if (minPower) query.powerOutput.$gte = Number(minPower);
      if (maxPower) query.powerOutput.$lte = Number(maxPower);
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with population
    const stations = await ChargingStation.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalStations = await ChargingStation.countDocuments(query);
    const totalPages = Math.ceil(totalStations / limitNum);

    const pagination = {
      currentPage: pageNum,
      totalPages,
      totalItems: totalStations,
      itemsPerPage: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    };

    return sendPaginatedResponse(res, 'Charging stations retrieved successfully', stations, pagination);

  } catch (error) {
    console.error('Get stations error:', error);
    return sendError(res, 'Failed to retrieve charging stations', 500);
  }
};

// @desc    Get single charging station
// @route   GET /api/stations/:id
// @access  Private
const getStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email');

    if (!station) {
      return sendError(res, 'Charging station not found', 404);
    }

    return sendSuccess(res, 'Charging station retrieved successfully', { station });

  } catch (error) {
    console.error('Get station error:', error);
    return sendError(res, 'Failed to retrieve charging station', 500);
  }
};

// @desc    Create new charging station
// @route   POST /api/stations
// @access  Private
const createStation = async (req, res) => {
  try {
    const stationData = {
      ...req.body,
      createdBy: req.user._id
    };

    const station = await ChargingStation.create(stationData);
    
    // Populate the created station
    await station.populate('createdBy', 'firstName lastName email');

    return sendSuccess(res, 'Charging station created successfully', { station }, 201);

  } catch (error) {
    console.error('Create station error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return sendError(res, `Validation failed: ${errors.join(', ')}`, 400);
    }
    return sendError(res, 'Failed to create charging station', 500);
  }
};

// @desc    Update charging station
// @route   PUT /api/stations/:id
// @access  Private
const updateStation = async (req, res) => {
  try {
    let station = await ChargingStation.findById(req.params.id);

    if (!station) {
      return sendError(res, 'Charging station not found', 404);
    }

    // Check if user owns the station or is admin
    if (station.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to update this charging station', 403);
    }

    station = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'firstName lastName email');

    return sendSuccess(res, 'Charging station updated successfully', { station });

  } catch (error) {
    console.error('Update station error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return sendError(res, `Validation failed: ${errors.join(', ')}`, 400);
    }
    return sendError(res, 'Failed to update charging station', 500);
  }
};

// @desc    Delete charging station
// @route   DELETE /api/stations/:id
// @access  Private
const deleteStation = async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);

    if (!station) {
      return sendError(res, 'Charging station not found', 404);
    }

    // Check if user owns the station or is admin
    if (station.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 'Not authorized to delete this charging station', 403);
    }

    await ChargingStation.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 'Charging station deleted successfully');

  } catch (error) {
    console.error('Delete station error:', error);
    return sendError(res, 'Failed to delete charging station', 500);
  }
};

// @desc    Get nearby charging stations
// @route   GET /api/stations/nearby/:longitude/:latitude
// @access  Private
const getNearbyStations = async (req, res) => {
  try {
    const { longitude, latitude } = req.params;
    const { maxDistance = 10000 } = req.query; // Default 10km radius

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lon) || isNaN(lat)) {
      return sendError(res, 'Invalid coordinates provided', 400);
    }

    const stations = await ChargingStation.findNearby(lon, lat, parseInt(maxDistance))
      .populate('createdBy', 'firstName lastName email');

    return sendSuccess(res, 'Nearby charging stations retrieved successfully', { stations });

  } catch (error) {
    console.error('Get nearby stations error:', error);
    return sendError(res, 'Failed to retrieve nearby charging stations', 500);
  }
};

// @desc    Get station statistics
// @route   GET /api/stations/stats
// @access  Private
const getStationStats = async (req, res) => {
  try {
    const totalStations = await ChargingStation.countDocuments();
    
    const statusStats = await ChargingStation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const connectorStats = await ChargingStation.aggregate([
      {
        $group: {
          _id: '$connectorType',
          count: { $sum: 1 }
        }
      }
    ]);

    const avgPowerOutput = await ChargingStation.aggregate([
      {
        $group: {
          _id: null,
          avgPower: { $avg: '$powerOutput' },
          maxPower: { $max: '$powerOutput' },
          minPower: { $min: '$powerOutput' }
        }
      }
    ]);

    const stats = {
      totalStations,
      statusDistribution: statusStats,
      connectorDistribution: connectorStats,
      powerStats: avgPowerOutput[0] || { avgPower: 0, maxPower: 0, minPower: 0 }
    };

    return sendSuccess(res, 'Station statistics retrieved successfully', { stats });

  } catch (error) {
    console.error('Get station stats error:', error);
    return sendError(res, 'Failed to retrieve station statistics', 500);
  }
};

module.exports = {
  getStations,
  getStation,
  createStation,
  updateStation,
  deleteStation,
  getNearbyStations,
  getStationStats
};
