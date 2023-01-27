// Imports
const Product = require("../models/product.model");
const Order = require("../models/order.model");

// Admin controller methods

async function getProducts(req, res, next) {
	// We get the list of products from the database
	let products;
	try {
		products = await Product.getProductsList();
	} catch (error) {
		next(error);
	}

	// Now we just render the template passing the products list
	res.render("admin/products/all-products", { products: products });
}

function getNewProduct(req, res) {
	res.render("admin/products/new-product");
}

async function createNewProduct(req, res, next) {
	// We create a product instance and add the received values of the form
	const product = new Product({
		...req.body, // Here is title, summary, price and description
		image: req.file.filename,
	});

	// Now we use the Product model method to save the product in the db
	try {
		await product.save();
	} catch (error) {
		next(error);
		return;
	}

	// Finally we redirect to the all products view
	res.redirect("/admin/products");
}

async function getUpdateProduct(req, res, next) {
	try {
		// We use static function to get product by id
		const product = await Product.findById(req.params.id);

		// If everything was right we render our update product view passing the product
		res.render("admin/products/update-product", { product: product });
	} catch (error) {
		next(error);
	}
}

async function updateProduct(req, res, next) {
	// We create a product instance and add the received values of the form
	const product = new Product({
		...req.body, // Here is title, summary, price and description
		_id: req.params.id,
	});

	// If we received another image we need to replace it
	if (req.file) {
		product.replaceImage(req.file.filename);
	}

	// Now we use the Product model method to save the product in the db
	try {
		await product.save();
	} catch (error) {
		next(error);
		return;
	}

	// Finally we redirect to the all products view
	res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
	// We use static function to get delete by id
	try {
		// If there is one we know remove it
		await Product.delete(req.params.id);
	} catch (error) {
		next(error);
		return;
	}

	// We return a response in json format since we used an ajax request
	res.json({ message: "Deleted product!" });
}

async function getOrders(req, res, next) {
	try {
		// Use the Order static method to get all orders of every user
		const orders = await Order.findAll();

		// Now we render the all orders management page
		res.render("admin/orders/admin-orders", { orders: orders });
	} catch (error) {
		return next(error);
	}
}

async function updateOrder(req, res, next) {
	// Get the order id and status
	const orderId = req.params.id;
	const newStatus = req.body.newStatus;

	try {
		// Get the specific order by id
		const order = await Order.findById(orderId);

		// Change the status to the new one
		order.status = newStatus;

		// Save the order
		await order.save();

		// Since it's an ajax request we send a json response in this case with the new status to be used to update the dom
		res.json({ message: "Order updated", newStatus: newStatus });
	} catch (error) {
		next(error);
	}
}

// Export our controller methods
module.exports = {
	getProducts: getProducts,
	getNewProduct: getNewProduct,
	createNewProduct: createNewProduct,
	getUpdateProduct: getUpdateProduct,
	updateProduct: updateProduct,
	deleteProduct: deleteProduct,
	getOrders: getOrders,
	updateOrder: updateOrder,
};
