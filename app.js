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
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");
const notFoundHandlerMiddleware = require("./middlewares/not-found");

// Routes
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const productsRoutes = require("./routes/products.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const ordersRoutes = require("./routes/orders.routes");

// Port environment variable
let PORT = 3000;

if (process.env.PORT) {
	PORT = process.env.PORT;
}

// Initialize our app
const app = express();

// Set our view template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve our static files located at the public folder
app.use(express.static("public"));

// Serve our product data folder where images are located
app.use("/products/assets", express.static("product-data")); // Only request starting with /products/assets will be served statically

// Set how are we going to parse requests
app.use(express.urlencoded({ extended: false }));

// Middleware to allow ajax request parsed for json formats
app.use(express.json());

// Create our session middleware
const sessionConfig = createSessionConfig();
app.use(session(sessionConfig));

// Middleware using protection against csrf attacks
app.use(csurf());

// Middleware to initialize or update cart
app.use(cartMiddleware);

// Middleware to update the cart prices in every request
app.use(updateCartPricesMiddleware);

// Call to the csrf custom middleware to create a locals variable with the token
app.use(addCsrfTokenMiddleware);

// Middleware to check auth status
app.use(checkAuthStatusMiddleware);

// Middleware to handle routes
app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use("/cart", cartRoutes); // Every request that starts with /cart will go here
app.use("/orders", protectRoutesMiddleware, ordersRoutes); // Every request that starts with /orders will go here
app.use("/admin", protectRoutesMiddleware, adminRoutes); // Every request that starts with /admin will go here

// Handle 404 or not found requests
app.use(notFoundHandlerMiddleware);

// Default error handling middleware
app.use(errorHandlerMiddleware);

// Start running the server
db.connect()
	.then(function () {				
		app.listen(PORT);
	})
	.catch(function (error) {
		console.log("Failed to connect to the database!");
		console.log("error");
	});
