// Packages and modules
const path = require("path");
const express = require("express");
const db = require("./data/database");
const csurf = require("csurf");
const session = require("express-session");
const createSessionConfig = require("./config/session");

// Custom middlewares
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");

// Routes
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const productsRoutes = require("./routes/products.routes");

// Initialize our app
const app = express();

// Set our view template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve our static files located at the public folder
app.use(express.static("public"));

// Set how are we going to parse requests
app.use(express.urlencoded({ extended: false }));

// Create our session middleware
const sessionConfig = createSessionConfig();
app.use(session(sessionConfig));

// Middleware using protection against csrf attacks
app.use(csurf());

// Call to the csrf custom middleware to create a locals variable with the token
app.use(addCsrfTokenMiddleware);

// Middleware to check auth status
app.use(checkAuthStatusMiddleware);

// Middleware to handle routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);

// Default error handling middleware
app.use(errorHandlerMiddleware);

// Start running the server
db.connect()
	.then(function () {
		app.listen(3000);
	})
	.catch(function (error) {
		console.log("Failed to connect to the database!");
		console.log("error");
	});
