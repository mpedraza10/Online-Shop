// Custom middleware to set the csrf token to every response so that it can be used in any route
function addCsrfToken(req, res, next) {
    // Set the locals variable with the request's csrfToken() 
    res.locals.csrfToken = req.csrfToken();

    // Jump the the next middleware
    next();
}

// Export the middleware
module.exports = addCsrfToken;