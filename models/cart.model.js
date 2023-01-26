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
}

// Expor the Cart model
module.exports = Cart;
