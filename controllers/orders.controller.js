// Imports
const Order = require("../models/order.model");
const User = require("../models/user.model");

// Stripe payment
const stripe = require("stripe")(
	"sk_test_51MV0KMJsvFBajOsxN6uSix2hi1x7zb7CJ0ohj2G3mtTkvzzI95JRyNOsLuZSG7MzEd4mkOO54cAxOF1AiFAoV0T800kKeW8u4d"
);

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

	// Now we make the transaction using stripe
	const session = await stripe.checkout.sessions.create({
		line_items: cart.items.map((item) => {            
			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: item.product.title,
					},
					unit_amount: +(+item.product.price.toFixed(2) * 100).toFixed(0),
				},
				quantity: item.quantity,
			};
		}),
		mode: "payment",
		success_url: `http://localhost:3000/orders/success`,
		cancel_url: `http://localhost:3000/orders/failure`,
	});

	// Stripe redirection to its site to handle payment
	res.redirect(303, session.url);
}

function getSuccess(req, res) {
	// Render success view
	res.render("customer/orders/success");
}

function getFailure(req, res) {
	// Render success view
	res.render("customer/orders/failure");
}

// Export our controller functions
module.exports = {
	addOrder: addOrder,
	getOrders: getOrders,
	getSuccess: getSuccess,
	getFailure: getFailure,
};
