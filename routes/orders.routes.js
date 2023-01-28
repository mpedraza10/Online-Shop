// Packages and modules required
const express = require("express");

// Controller
const ordersController = require("../controllers/orders.controller");

// Create our router
const router = express.Router();

// Routes
router.get("/", ordersController.getOrders);

router.post("/", ordersController.addOrder); // /orders/

router.get("/success", ordersController.getSuccess);

router.get("/failure", ordersController.getFailure);

// Export the router
module.exports = router;
