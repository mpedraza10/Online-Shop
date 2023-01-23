// Middleware to handle errors
function handleErrors(error, req, res, next) {
    console.log(error);

    // Check if the error has a 404 code and render the 404 page
    if (error.code === 404) {
        return res.status(404).render("shared/404");
    }

    // Else we render the 500 error page
    res.status(500).render("shared/500");
}

module.exports = handleErrors;