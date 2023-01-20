// Imports
const Product = require("../models/product.model");

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

// Export our controller methods
module.exports = {
	getProducts: getProducts,
	getNewProduct: getNewProduct,
	createNewProduct: createNewProduct,
};
