const jwt = require("jsonwebtoken");
const config = require("config");

// Middleware for user authentication using JSON Web Tokens (JWT)
// This middleware extracts the JWT from the 'x-auth-token' header in the HTTP request,
// verifies its authenticity using the configured 'jwtPrivateKey', and attaches the
// decoded user information to the request object.
function auth(req, res, next) {
    // Extracting the JWT from the 'x-auth-token' header
    const token = req.header("x-auth-token");

    // If no token is provided, return a 401 status with an error message
    if (!token) {
        return res.status(401).send("Access denied. Token is not provided.");
    }

    try {
        // Verifying the authenticity of the JWT using the configured 'jwtPrivateKey'
        const decodedPayload = jwt.verify(token, config.get("jwtSecret"));

        // Attaching the decoded user information to the request object for further use
        req.user = decodedPayload;

        // Move to the next middleware or route handler
        next();
    } catch (err) {
        // If the token is invalid, return a 400 status with an error message
        res.status(400).send("invalid token");
    }
}

module.exports = auth;
