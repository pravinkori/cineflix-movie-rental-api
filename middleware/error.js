/**
 * Error-handling middleware for handling internal server errors.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the chain.
 */
function error(err, req, res, next) {
    // Set the HTTP status code to 500 (Internal Server Error) and send a generic error message
    res.status(500).send("Something failed.");
}

module.exports = error;
