function checkAuthStatus(req, res, next) {
    // Get the uid generated if a user is logged in
    const uid = req.session.uid;

    // If we don't have one we continue with the next middleware
    if (!uid) {
        return next();    
    }

    // If it is authenticated we set this values to the response locals
    res.locals.uid = uid;
    res.locals.isAuth = true;

    // Continue with the next middleware
    next();
}

module.exports = checkAuthStatus;