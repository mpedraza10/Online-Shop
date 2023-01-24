// Packages and modules required
const express = require("express");

// Controller
const productsController = require("../controllers/products.controller");

// Create our router
const router = express.Router();

// Routes
router.get("/products", productsController.getAllProducts);

router.get("/products/:id", productsController.getDetailProduct)

// Export the router
module.exports = router;
