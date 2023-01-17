// Imports
const User = require("../models/user.model");

// Auth controller methods
function getSignup(req, res) {
	res.render("customer/auth/signup");
}

async function signup(req, res) {
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
		!enteredEmail ||
		!enteredConfirmEmail ||
		!enteredPassword ||
		enteredEmail !== enteredConfirmEmail ||
		enteredPassword < 6
	) {
        console.log("Invalid data");
        return res.redirect("/signup");
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
    const isExistingUser = await user.isExistingUser();

    // If we have a user with the given email then we redirect to signup
    if (isExistingUser) {
        console.log("Email is already registered!");
        return res.redirect("/signup");
    }

	// Now we use the signup method to store the user data in the database
	await user.signup();

	// Finally we redirect to login
	res.redirect("/login");
}

function getLogin(req, res) {
	res.render("customer/auth/login");
}

async function login(req, res) {
	// Create variables with the submitted values
	const enteredEmail = req.body.email;
	const enteredPassword = req.body.password;

	// Create our user with the user model
	const user = new User(enteredEmail, enteredPassword);

	// Check if user exists
	const existingUser = await user.isExistingUser();

	// If we don't have a user with the given email we return
	if (!existingUser) {
		console.log("No user with that email");
		return res.redirect("/login");
	}

	// Now check if the given password is correct
	const isCorrectPassword = await user.passwordsAreEqual(existingUser);

	// If passwords are not equal we return to login
	if (!isCorrectPassword) {
		console.log("Password doesn't match!");
		return res.redirect("/login");
	}

	// If user was created successfully we can add our session parameters
	req.session.isAuth = true;

	// Finally we redirect to login after saving the changes of the session
	req.session.save(function () {
		//res.redirect("/cart");
		console.log("We are logged in!");
	});
}

function logout(req, res) {
	req.session.isAuth = false;

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
