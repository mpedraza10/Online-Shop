// Imports
const Product = require("../models/product.model");

// Cart model class
class Cart {
	constructor(items = [], totalQuantity = 0, totalPrice = 0) {
		this.items = items; // List of items in cart
		this.totalQuantity = totalQuantity;
		this.totalPrice = totalPrice;
	}

	addItem(product) {
		// Create cart item initial state
		const cartItem = {
			product: product,
			quantity: 1,
			totalPrice: product.price,
		};

		// We loop through all the items in the items list to check if we already have one in the cart
		for (let i = 0; i < this.items.length; i++) {
			// Select items of the cart
			const item = this.items[i];

			// If the current item's id is the same as the product we're adding then we update its quantity and total price
			if (item.product.id === product.id) {
				// We update the item that was already in the cart using the cartItem object
				cartItem.quantity = +item.quantity + 1;
				cartItem.totalPrice = item.totalPrice + product.price;
				this.items[i] = cartItem; // When we finish we just update in the position were the item was with the new cartItem

				// Update the total quantity and price of all items
				this.totalQuantity++;
				this.totalPrice += product.price;
				return;
			}
		}

		// Finally push the cart item
		this.items.push(cartItem);

		// Update the total quantity and price of all items
		this.totalQuantity++;
		this.totalPrice += product.price;
	}

	updateItem(productId, newQuantity) {
		for (let i = 0; i < this.items.length; i++) {
			// Select items of the cart
			const item = this.items[i];

			// If the current item's id is the same as the product we're adding then we update its quantity and total price
			if (item.product.id === productId && newQuantity > 0) {
				// Create a cartItem and copy the properties of item in the cart
				const cartItem = { ...item };
				const quantityChange = newQuantity - item.quantity; // Calculate if the total quantity will increase or decrease
				// Update quantity and price
				cartItem.quantity = newQuantity;
				cartItem.totalPrice = newQuantity * item.product.price;
				this.items[i] = cartItem; // When we finish we just update in the position were the item was with the new cartItem

				// Update the total quantity and price of all items
				this.totalQuantity = this.totalQuantity + quantityChange;
				this.totalPrice += quantityChange * item.product.price;
				return { updatedItemPrice: cartItem.totalPrice };
			} else if (item.product.id === productId && newQuantity <= 0) {
				this.items.splice(i, 1); // Allows us to remove items of array using index
				this.totalQuantity = this.totalQuantity - item.quantity;
				this.totalPrice -= item.totalPrice;
				return { updatedItemPrice: 0 };
			}
		}
	}

	async updatePrices() {
		// Get an array of every product id in the cart
		const productIds = this.items.map(function (item) {
			return item.product.id;
		});

		// Get all the products with the given ids of all products
		const products = await Product.findMultiple(productIds);

		// Helper array to delete cart items
		const deletableCartItemProductIds = [];

		// We iterate through all the items in the cart
		for (const cartItem of this.items) {
			// We search in the array of all products and find the products that are in the cart and store it in a variable
			const product = products.find((prod) => {
				return prod.id === cartItem.product.id;
			});

            // If we couldn' find a matching product that is both in the cart and in all the products then it was deleted
			if (!product) {
				// Product was deleted!
				// "Schedule" for removal from cart
				deletableCartItemProductIds.push(cartItem.product.id);
				continue;
			}

			// Product was not deleted
			// Set product data and total price to latest price from database
			cartItem.product = product;
			cartItem.totalPrice = cartItem.quantity * cartItem.product.price;
		}

		// If we have any deletable items we proceed to delete
		if (deletableCartItemProductIds.length > 0) {
			this.items = this.items.filter((item) => {
				return deletableCartItemProductIds.indexOf(item.product.id) < 0; // Return true to keep item and false to delete item
			});
		}

		// Re-calculate cart totals
		this.totalQuantity = 0;
		this.totalPrice = 0;

        // Loop through all the items in the cart
		for (const item of this.items) {
			this.totalQuantity = this.totalQuantity + item.quantity;
			this.totalPrice = this.totalPrice + item.totalPrice;
		}
	}
}

// Expor the Cart model
module.exports = Cart;
