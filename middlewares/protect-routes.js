// Middleware to protect admin routes
function protectRoutes(req, res, next) {
    // First check if user is authenticated
    if (!res.locals.isAuth) {
        return res.redirect("/401"); // Not authenticated
    }

    // Validate if the path of the request starts with admin and cgheck if user is actually admin
    if (req.path.startsWith("/admin") && !res.locals.isAdmin) {
        return res.redirect("/403"); // Not authorized
    }

    // Finally we call the next function
    next();
}

// Export middleware
module.exports = protectRoutes;