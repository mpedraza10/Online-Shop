// Middleware to redirect not found request
function notFoundHandler(req, res) {
	res.render("shared/404");
}

// Export the middleware
module.exports = notFoundHandler;
