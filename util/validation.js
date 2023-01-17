// Util function to check if an input was empty
function isEmpty(value) {
	return !value || value.trim() === "";
}

// Util function to check email and password credentials
function userCredentialsAreValid(email, confirmEmail, password) {
	return email && email.includes("@") && email === confirmEmail && password.trim().length >= 6;
}

// Util function that returns true if all details entered are valid
function userDetailsAreValid(email, confirmEmail, password, name, street, postal, city) {
	return (
		userCredentialsAreValid(email, confirmEmail, password) &&
		!isEmpty(name) &&
		!isEmpty(street) &&
		!isEmpty(postal) &&
		!isEmpty(city)
	);
}

// Export the user detial function
module.exports = userDetailsAreValid;