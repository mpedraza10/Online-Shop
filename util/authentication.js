// Util function to create a user valid auth session
function createUserSession(req, user, action) {
	// If user was created successfully we can add our session parameters
    req.session.uid = user._id.toString();
    req.session.isAdmin = user.isAdmin;

	// Finally we redirect to login after saving the changes of the session
	req.session.save(action);
}

// Util function to destroy user session
function destroyUserAuthSession(req) {
    // Set the uid to null to indicate that the user is no longer authenticated
    req.session.uid = null;
}

module.exports = {
    createUserSession: createUserSession,
    destroyUserAuthSession: destroyUserAuthSession,
};
