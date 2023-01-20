// Imports
const multer = require("multer");
const uuid = require("uuid").v4;

// Multer configuration
const upload = multer({
	storage: multer.diskStorage({
		destination: "product-data/images",
		filename: function (req, file, cb) {
			cb(null, uuid() + "-" + file.originalname);
		},
	}),
});

// Using single method we get a single file by the name we gave it on the form and it return our final middleware function
const cofiguredMulterMiddleware = upload.single("image");

// Export the middleware
module.exports = cofiguredMulterMiddleware;
