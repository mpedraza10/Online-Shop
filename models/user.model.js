// Imports
const db = require("../data/database");
const bcrypt = require("bcryptjs");

// User class model
class User {
	constructor(email, password, fullname, street, postal, city) {
		this.email = email;
		this.password = password;
		this.name = fullname;
		this.address = {
			street: street,
			postal: postal,
			city: city,
		};
	}

	// Method to create and insert a new user
	async signup() {
		// Use bcrypt to hash the password
		const hashedPassword = await bcrypt.hash(this.password, 12);

		// Insert the new user data in the database
		await db.getDb().collection("users").insertOne({
			email: this.email,
			password: hashedPassword,
			name: this.name,
			address: this.address,
		});
	}

	// Method to check if given password is the same as the stored one
	async passwordsAreEqual(hashedPassword) {
		// Check if the password is correct
		const isCorrectPassword = await bcrypt.compare(
			this.password,
			hashedPassword
		);		

        // Returns either true or false
        return isCorrectPassword;
	}

	// Method to check if a given email is a user registered
	async isExistingUser() {
		// Check if we have a user in the db with the entered email
		const existingUser = await db
			.getDb()
			.collection("users")
			.findOne({ email: this.email });

		// We return either the user or undefined
		return existingUser;
	}
}

// Export our model
module.exports = User;
