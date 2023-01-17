// Packages and modules required
const express = require("express");

// Controller
const productsController = require("../controllers/products.controller");

// Create our router
const router = express.Router();

// Routes
router.get("/products", productsController.getProducts);

// Export the router
module.exports = router;
