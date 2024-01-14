/**
 * Wraps an asynchronous route handler with error handling middleware.
 *
 * @param {Function} handler - Asynchronous route handler function.
 * @returns {Function} - A middleware function with error handling for asynchronous operations.
 */
function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
            // Execute the asynchronous route handler
            await handler(req, res);
        } catch (err) {
            // Pass any caught errors to the next middleware in the chain
            next(err);
        }
    };
}

module.exports = asyncMiddleware;
