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
			const item = this.items[i];
			// If the current item's id is the same as the product we're adding then we update its quantity and total price
			if (item.product.id === product.id) {
				cartItem.quantity++;
				cartItem.totalPrice += product.price;
				this.items[i] = cartItem;

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
}

// Expor the Cart model
module.exports = Cart;