// Packages and modules required
const express = require("express");

// Controller
const adminController = require("../controllers/admin.controller");

// Image upload middleware
const imageUploadMiddleware = require("../middlewares/image-upload");

// Create our router
const router = express.Router();

// Routes
router.get("/products", adminController.getProducts);

router.get("/products/new", adminController.getNewProduct);

router.post("/products", imageUploadMiddleware, adminController.createNewProduct);

router.get("/products/:id", adminController.getUpdateProduct);

router.post("/products/:id", imageUploadMiddleware, adminController.updateProduct);

// Export the router
module.exports = router;
