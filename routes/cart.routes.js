// Packages and modules required
const express = require("express");

// Controller
const cartController = require("../controllers/cart.controller");

// Create our router
const router = express.Router();

// Routes
router.get("/", cartController.getCart);

router.post("/items", cartController.addCartItem); // /cart/items

router.patch("/items", cartController.updateCartItem); // patch is used to update parts of existing data

// Export the router
module.exports = router;
