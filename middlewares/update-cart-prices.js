// Middleware function to update the cart prices
async function updateCartPrices(req, res, next) {
    // Get the cart
    const cart = res.locals.cart;

    // Call the updated prices method
    await cart.updatePrices();

    next();
}

// Export the middleware
module.exports = updateCartPrices;