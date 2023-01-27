// Imports
const db = require("../data/database");
const mongodb = require("mongodb");

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

	static transformOrderDocument(orderDoc) {
		return new Order(
			orderDoc.productData,
			orderDoc.userData,
			orderDoc.status,
			orderDoc.date,
			orderDoc._id
		);
	}

	static transformOrderDocuments(orderDocs) {
		return orderDocs.map(this.transformOrderDocument);
	}

	static async findAll() {
		// Get all the orders from the db
		const ordersDocument = await db
			.getDb()
			.collection("orders")
			.find()
			.sort({ _id: -1 })
			.toArray();

		// Return the list with all the orders transformed to order class model
		return this.transformOrderDocuments(ordersDocument);
	}

	static async findAllForUser(userId) {
		// Transform the uid string to object id
		const uid = new mongodb.ObjectId(userId);

		// Get all the orders from a specific user in the db
		const ordersDocument = await db
			.getDb()
			.collection("orders")
			.find({ "userData._id": uid })
			.sort({ _id: -1 })
			.toArray();

		// Return the list with all the user specific orders transformed to order class model
		return this.transformOrderDocuments(ordersDocument);
	}

	static async findById(orderId) {
		// Transform the order string id to object id
		const orderid = new mongodb.ObjectId(orderId);

		// Get the specific order by passing the id
		const orderDocument = await db
			.getDb()
			.collection("orders")
			.findOne({ _id: orderid });

		// Return the specific order transformed to order class model
		return this.transformOrderDocument(orderDocument);
	}

	async save() {
		// Check if we are updating or adding a new order by checking if we already have an id in the order
		if (this.id) {
			// Updating, first transform the id into object id
			const orderId = new mongodb.ObjectId(this.id);

			// Update the status of the order
			await db
				.getDb()
				.collection("orders")
				.updateOne({ _id: orderId }, { $set: { status: this.status } });
		} else {
			// Adding new order so we create the order object with all data needed
			const orderDocument = {
				userData: this.userData,
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
