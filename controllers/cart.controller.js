// Imports
const Product = require("../models/product.model");

// Cart controller functions

async function addCartItem(req, res, next) {    
    let product;
    try {
        // Use the Product model to find the product by id
        const productDocument = await Product.findById(req.body.productId);
        product = new Product(productDocument);
    } catch (error) {
        next(error);
        return;
    }

    // Once we have the product we add it the cart
    const cart = res.locals.cart;    
    cart.addItem(product);

    // Then overrite to update the session cart with the newly added one
    req.session.cart = cart;

    // Since it's handle as an ajax request we just send a json as response
    res.status(201).json({
        message: "Cart updated!",
        newTotalItems: cart.totalQuantity,
    });
}

// Export the controller functions
module.exports = {
	addCartItem: addCartItem,
};
