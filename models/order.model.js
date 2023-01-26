// Imports
const db = require("../data/database");

// Model Order class
class Order {
	// Status => pending, fullfilled, canceld
	constructor(cart, userData, status = "pending", date, orderId) {
		this.productData = cart;
		this.userData = userData;
		this.status = status;
		this.date = new Date(date); // received date should be string representation of date like 2021-07-16
		if (this.date) {
			this.formattedDate = this.date.toLocaleDateString("es-MX", {
				weekday: "short",
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		}
		this.id = orderId;
	}

	async save() {
		// Check if we are updating or adding a new order by checking if we already have an id in the order
		if (this.id) {
			// Updating
		} else {
			// Adding new order so we create the order object with all data needed
			const orderDocument = {
				userDate: this.userData,
				productData: this.productData,
				date: new Date(),
				status: this.status,
			};

            // Insert the order document
            await db.getDb().collection("orders").insertOne(orderDocument);
		}
	}
}

// Export the Order model
module.exports = Order;
