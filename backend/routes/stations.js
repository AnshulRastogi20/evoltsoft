const express = require('express');
const { protect } = require('../middleware/auth');
const {
  validateChargingStation,
  validateObjectId,
  validateStationQuery
} = require('../utils/validation');
const {
  getStations,
  getStation,
  createStation,
  updateStation,
  deleteStation,
  getNearbyStations,
  getStationStats
} = require('../controllers/stationController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Statistics route (before parameterized routes)
router.get('/stats', getStationStats);

// Nearby stations route
router.get('/nearby/:longitude/:latitude', getNearbyStations);

// Main CRUD routes
router.route('/')
  .get(validateStationQuery, getStations)
  .post(validateChargingStation, createStation);

router.route('/:id')
  .get(validateObjectId, getStation)
  .put(validateObjectId, validateChargingStation, updateStation)
  .delete(validateObjectId, deleteStation);

module.exports = router;
