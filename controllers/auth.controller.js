// Imports
const User = require("../models/user.model");

// Util functions
const authUtil = require("../util/authentication");
const userDetailsAreValid = require("../util/validation");

// Auth controller methods

function getSignup(req, res) {
    // First we save the input data if an error occured
	let sessionInputData = req.session.inputData;

    // If is the first time we go to login or didn't make mistakes then the form is empty
	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			email: "",
			confirmEmail: "",
			password: "",
			fullname: "",
			street: "",
			postal: "",
			city: "",
		};
	}

    // If we had an error then we clear the session content since it's already saved in the sessionInputData
	req.session.inputData = null;

    // Finally we render the login view with the values empty or with the previously entered
	res.render("customer/auth/signup", { sessionInputData: sessionInputData });
}

async function signup(req, res, next) {
	// Create variables with the submitted values
	const inputData = req.body;
	const enteredEmail = inputData.email;
	const enteredPassword = inputData.password;
	const enteredConfirmEmail = inputData["confirm-email"];
	const enteredFullname = inputData.fullname;
	const enteredStreet = inputData.street;
	const enteredPostal = inputData.postal;
	const enteredCity = inputData.city;

	// Validate given input
	if (
		!userDetailsAreValid(
			enteredEmail,
			enteredConfirmEmail,
			enteredPassword,
			enteredFullname,
			enteredStreet,
			enteredPostal,
			enteredCity
		)
	) {
		// We save the entered input in a temporary session
		req.session.inputData = {
			hasError: true,
			title: "Invalid data!",
			message: "Invalid input - please check your data.",
			email: enteredEmail,
			confirmEmail: enteredConfirmEmail,
			password: enteredPassword,
			fullname: enteredFullname,
			street: enteredStreet,
			postal: enteredPostal,
			city: enteredCity,
		};

		// Save the session and redirect
		req.session.save(function () {
			res.redirect("/signup");
		});
		return;
	}

	// Create a new user using the User model
	const user = new User(
		enteredEmail,
		enteredPassword,
		enteredFullname,
		enteredStreet,
		enteredPostal,
		enteredCity
	);

	// Check if entered email is not already registered
	let isExistingUser;
	try {
		isExistingUser = await user.isExistingUser();
	} catch (error) {
		next(error);
		return;
	}

	// If we have a user with the given email then we redirect to signup
	if (isExistingUser) {
		// We save the entered input in a temporary session
		req.session.inputData = {
			hasError: true,
			title: "Invalid data!",
			message: "The entered email is already registered.",
			email: enteredEmail,
			confirmEmail: enteredConfirmEmail,
			password: enteredPassword,
			fullname: enteredFullname,
			street: enteredStreet,
			postal: enteredPostal,
			city: enteredCity,
		};

		// Save the session and redirect
		req.session.save(function () {
			res.redirect("/signup");
		});
		return;
	}

	// Now we use the signup method to store the user data in the database
	try {
		await user.signup();
	} catch (error) {
		next(error);
		return;
	}

	// Finally we redirect to login
	res.redirect("/login");
}

function getLogin(req, res) {
	// First we save the input data if an error occured
	let sessionInputData = req.session.inputData;

	// If is the first time we go to login or didn't make mistakes then the form is empty
	if (!sessionInputData) {
		sessionInputData = {
			hasError: false,
			email: "",
			password: "",
		};
	}

	// If we had an error then we clear the session content since it's already saved in the sessionInputData
	req.session.inputData = null;

	// Finally we render the login view with the values empty or with the previously entered
	res.render("customer/auth/login", { sessionInputData: sessionInputData });
}

async function login(req, res, next) {
	// Create variables with the submitted values
	const enteredEmail = req.body.email;
	const enteredPassword = req.body.password;

	// Create our user with the user model
	const user = new User(enteredEmail, enteredPassword);

	// Check if user exists
	let existingUser;
	try {
		existingUser = await user.isExistingUser();
	} catch (error) {
		next(error);
		return;
	}

	// If we don't have a user with the given email we return
	if (!existingUser) {
		// We save the entered input in a temporary session
		req.session.inputData = {
			hasError: true,
			title: "Invalid data!",
			message: "The entered email is already registered.",
			email: enteredEmail,
			password: enteredPassword,
		};

		// Save the session and redirect
		req.session.save(function () {
			res.redirect("/login");
		});
		return;
	}

	// Now check if the given password is correct
	const isCorrectPassword = await user.passwordsAreEqual(existingUser.password);

	// If passwords are not equal we return to login
	if (!isCorrectPassword) {
		// We save the entered input in a temporary session
		req.session.inputData = {
			hasError: true,
			title: "Invalid data!",
			message: "You've entered a wrong password. Please try again.",
			email: enteredEmail,
			password: enteredPassword,
		};

		// Save the session and redirect
		req.session.save(function () {
			res.redirect("/login");
		});
		return;
	}

	// Use util function to create a user session
	authUtil.createUserSession(req, existingUser, function () {
		res.redirect("/");
	});
}

function logout(req, res) {
	// Use util function to destroy an auth user session
	authUtil.destroyUserAuthSession(req);
	res.redirect("/login");
}

// Export the functions
module.exports = {
	getSignup: getSignup,
	getLogin: getLogin,
	signup: signup,
	login: login,
	logout: logout,
};
