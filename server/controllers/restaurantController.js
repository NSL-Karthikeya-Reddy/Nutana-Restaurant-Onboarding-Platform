const Restaurant = require('../models/Restaurant');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
const checkFileType = (file, cb) => {
  // Allowed extensions
  const filetypes = /jpg|jpeg|png|pdf/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only JPG, JPEG, PNG and PDF files are allowed!');
  }
};

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Upload both logo and certificate
const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'certificate', maxCount: 1 },
]);

// @desc    Create a new restaurant
// @route   POST /api/restaurants
// @access  Private
const createRestaurant = async (req, res) => {
  try {
    const { name, description, contactPhone, businessHours } = req.body;

    // Check if files exist in the request
    if (!req.files || !req.files.logo || !req.files.certificate) {
      return res.status(400).json({ message: 'Please upload all required files' });
    }

    const logoPath = req.files.logo[0].path;
    const certificatePath = req.files.certificate[0].path;

    // Create restaurant
    const restaurant = await Restaurant.create({
      name,
      description,
      contactPhone,
      businessHours,
      logo: logoPath,
      certificate: certificatePath,
      user: req.user ? req.user._id : null,
    });

    if (restaurant) {
      res.status(201).json(restaurant);
    } else {
      res.status(400).json({ message: 'Invalid restaurant data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all approved restaurants
// @route   GET /api/restaurants
// @access  Public
const getApprovedRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: 'approved' });
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all restaurants (for admin)
// @route   GET /api/restaurants/admin
// @access  Private/Admin
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get restaurant by ID
// @route   GET /api/restaurants/:id
// @access  Private/Admin
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get restaurant by unique ID
// @route   GET /api/restaurants/check/:uniqueId
// @access  Public
const getRestaurantByUniqueId = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ uniqueId: req.params.uniqueId });

    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update restaurant status (admin only)
// @route   PUT /api/restaurants/:id/status
// @access  Private/Admin
const updateRestaurantStatus = async (req, res) => {
  try {
    const { status, adminComments } = req.body;

    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      restaurant.status = status || restaurant.status;
      restaurant.adminComments = adminComments || restaurant.adminComments;

      const updatedRestaurant = await restaurant.save();
      res.json(updatedRestaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  uploadFields,
  createRestaurant,
  getApprovedRestaurants,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantByUniqueId,
  updateRestaurantStatus,
};