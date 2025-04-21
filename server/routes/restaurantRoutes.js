const express = require('express');
const router = express.Router();
const {
  uploadFields,
  createRestaurant,
  getApprovedRestaurants,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantByUniqueId,
  updateRestaurantStatus,
} = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getApprovedRestaurants);
router.get('/check/:uniqueId', getRestaurantByUniqueId);

// Protected routes
router.post('/', protect, uploadFields, createRestaurant);

// Admin routes
router.get('/admin', protect, admin, getAllRestaurants);
router.get('/:id', protect, admin, getRestaurantById);
router.put('/:id/status', protect, admin, updateRestaurantStatus);

module.exports = router;