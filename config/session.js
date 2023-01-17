const session = require("express-session");
const mongodbStore = require("connect-mongodb-session");

function createSessionStore() {
	// Get our mongodbstore constructor
	const MongoDBStore = mongodbStore(session);

	// Session storage configuration
	const sessionStorage = new MongoDBStore({
		uri: "mongodb://localhost/27017",
		databaseName: "online-shop",
		collection: "sessions",
	});

	return sessionStorage;
}

function createSessionConfig() {
	return {
		secret: "super-secret-lol",
		resave: false,
		saveUninitialized: false,
		store: createSessionStore(),
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
		},
	};
}

module.exports = createSessionConfig;
