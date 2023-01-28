const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// Setting evironment variable
let mongodbUrl = "mongodb://localhost:27017";
if (process.env.MONGODB_URL) {
	mongodbUrl = process.env.MONGODB_URL;
}

let database;

async function connectToDb() {
	const client = await MongoClient.connect(mongodbUrl);
	database = client.db("online-shop");
}

function getDb() {
	if (!database) {
		throw new Error("You must connect first!");
	} else {
		return database;
	}
}

module.exports = {
	connect: connectToDb,
	getDb: getDb,
};
