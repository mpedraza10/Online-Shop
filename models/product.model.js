// Imports
const db = require("../data/database");
const mongodb = require("mongodb");

// Product model to handle db calls related to the product
class Product {
	constructor(productData) {
		this.title = productData.title;
		this.summary = productData.summary;
		this.price = +productData.price;
		this.description = productData.description;
		this.image = productData.image; // Name of the image file
		this.updateImageData();
		if (productData._id) {
			this.id = productData._id.toString();
		}
	}

	static async getProductsList() {
		// We get the products from the db and transform it to a list
		const products = await db.getDb().collection("products").find().toArray();

		// We transform every item of the array into an insatnce of Product in order to reconstruct the imagePath and url
		return products.map(function (productDocument) {
			return new Product(productDocument);
		});
	}

	static async findById(productId) {
		// Convert the string id into the mongodb object id
		let prodId;
		try {
			prodId = new mongodb.ObjectId(productId);
		} catch (error) {
			error.code = 404;
			throw error;
		}

		// We make a call to the db to find product with specific id
		const product = await db
			.getDb()
			.collection("products")
			.findOne({ _id: prodId });

		// Handle error if couldn't get product
		if (!product) {
			// State error and throw it
			const error = new Error(
				"Could not find the product with the provided id"
			);
			error.code = 404;
			throw error;
		}

		// We return the product
		return product;
	}

    updateImageData () {
        this.imagePath = `product-data/images/${this.image}`; // Path where the image is stored
		this.imageUrl = `/products/assets/images/${this.image}`; // Url used in front ent to request the image
    }

	async save() {
		// We create the object we are going to store in the db
		const productData = {
			title: this.title,
			summary: this.summary,
			price: this.price,
			description: this.description,
			image: this.image,
		};

		// If we have an id it means we are updating else we are creating one
		if (this.id) {
			// Convert into object id
			const productId = new mongodb.ObjectId(this.id);

            // If we don't have the image we delete it
            if (!this.image) {
                delete productData.image;
            }

            // Update the entry
			await db
				.getDb()
				.collection("products")
				.updateOne({ _id: productId }, { $set: productData });
		} else {
			// Insert the product data in the db
			await db.getDb().collection("products").insertOne(productData);
		}
	}    

    replaceImage(newImage) {
        // Update the image data when replacing image
        this.image = newImage;        
        this.updateImageData();
    }
}

// Expor our product model
module.exports = Product;
