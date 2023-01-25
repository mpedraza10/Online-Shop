// Imports
const Cart = require("../models/cart.model");

// Middleware to initialize a cart
function initializeCart(req, res, next) {
	// If we don't have a cart we create a new cart else we update it by passing the previous items
	let cart;
	if (!req.session.cart) {
		cart = new Cart();
	} else {
        // Reassign the cart with the items, quantity and price it had before
		const sessionCart = req.session.cart;
		cart = new Cart(
			sessionCart.items,
			sessionCart.totalQuantity,
			sessionCart.totalPrice
		);
	}

	// Assign a locals cart poiting to the newly created or updated cart
	res.locals.cart = cart;

	// Go to the next middleware after finishing
	next();
}

// Export the middleware
module.exports = initializeCart;
