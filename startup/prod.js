const helmet = require("helmet");
const compression = require("compression");

// Middleware Export
/**
 * Configures and applies essential security and performance-enhancing middleware to the Express app.
 *
 * @param {Object} app - The Express app instance.
 */
module.exports = function (app) {
    // Apply Helmet middleware for enhanced security headers.
    app.use(helmet());

    // Compresses response data for efficient data transfer/response.
    app.use(compression());
};
