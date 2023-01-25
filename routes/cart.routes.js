// Packages and modules required
const express = require("express");

// Controller
const cartController = require("../controllers/cart.controller");

// Create our router
const router = express.Router();

// Routes
router.post("/items", cartController.addCartItem); // /cart/items

// Export the router
module.exports = router;
