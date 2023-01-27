// Imports
const Order = require("../models/order.model");
const User = require("../models/user.model");

// Orders controller functions
async function getOrders(req, res, next) {    
    try {
        // First we need to get the orders of a given user
        const orders = await Order.findAllForUser(res.locals.uid);

        // Render the all orders view
	    res.render("customer/orders/all-orders", { orders: orders });
    } catch (error) {
        return next(error);
    }	
}

async function addOrder(req, res, next) {
	// Acces the cart of stored in locals
	const cart = res.locals.cart;

	// Get the user data from User model
	let userData;
	try {
		userData = await User.getUserById(res.locals.uid);
	} catch (error) {
		return next(error);
	}

	// Create a new Order using our model
	const order = new Order(cart, userData);

	// Now we can add the new order to the db
	try {
		await order.save();
	} catch (error) {
		return next(error);
	}

    // After we save the order we then empty the session cart
    req.session.cart = null;	

    // Finally we redirect to the orders view
	res.redirect("/orders");
}

// Export our controller functions
module.exports = {
	addOrder: addOrder,
	getOrders: getOrders,
};
