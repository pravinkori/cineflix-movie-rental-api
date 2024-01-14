/**
 * Middleware for restricting access to admin-only routes.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the chain.
 */
function admin(req, res, next) {
    // Check if the user is an admin; if not, respond with a 403 status (Access Denied)
    if (!req.user.isAdmin) {
        res.status(403).send("Access denied");
    }
    // Move to the next middleware or route handler in the chain
    next();
}

module.exports = admin;
