// Imports
const db = require("../data/database");

// Product model to handle db calls related to the product
class Product {
	constructor(productData) {
		this.title = productData.title;
		this.summary = productData.summary;
		this.price = +productData.price;
		this.description = productData.description;
		this.image = productData.image; // Name of the image file
		this.imagePath = `product-data/images/${productData.image}`; // Path where the image is stored
		this.imageUrl = `/products/assets/images/${productData.image}`; // Url used in front ent to request the image
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

	async save() {
		// We create the object we are going to store in the db
		const productData = {
			title: this.title,
			summary: this.summary,
			price: this.price,
			description: this.description,
			image: this.image,
		};

		// Insert the product data in the db
		await db.getDb().collection("products").insertOne(productData);
	}
}

// Expor our product model
module.exports = Product;
