// Imports
const Product = require("../models/product.model");

// Products controller
async function getAllProducts(req, res, next) {
	// We get the list of products from the database
	let products;
	try {
		products = await Product.getProductsList();
	} catch (error) {
		next(error);
	}

	// Send the list and render the customer all products section
	res.render("customer/products/all-products", { products: products });
}

async function getDetailProduct(req, res, next) {
	// Use static function to get the product by id
	let product;
	try {
		// Get the product from db and transform it into a Product instance
		const productDocument = await Product.findById(req.params.id);
		product = new Product(productDocument);
	} catch (error) {
		return next(error);
	}

	res.render("customer/products/product-detail", { product: product });
}

// Export the functions
module.exports = {
	getAllProducts: getAllProducts,
	getDetailProduct: getDetailProduct,
};
