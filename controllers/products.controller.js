// Products controller
function getProducts(req, res) {
	res.render("customer/products/all-products");
}

// Export the functions
module.exports = {
	getProducts: getProducts,
};
