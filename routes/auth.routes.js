// Packages and modules required
const express = require("express");

// Controller
const authController = require("../controllers/auth.controller");

// Create our router
const router = express.Router();

// Routes
router.get("/signup", authController.getSignup);

router.post("/signup", authController.signup);

router.get("/login", authController.getLogin);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

// Export the router
module.exports = router;
