// Packages and modules required
const express = require("express");

// Create our router
const router = express.Router();

// Routes
router.get("/", function(req, res) {
    res.redirect("/products");
});

router.get("/401", function (req, res) {
    res.status(401).render("shared/401");
});

router.get("/403", function (req, res) {
    res.status(403).render("shared/403");
});

// Export the router
module.exports = router;
