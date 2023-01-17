// Packages and modules required
const express = require("express");

// Controller


// Create our router
const router = express.Router();

// Routes
router.get("/", function(req, res) {
    res.redirect("/products");
});

// Export the router
module.exports = router;
