const config = require("config");

module.exports = function () {
    // Check if jwtSecret is defined in the configuration
    if (!config.get("jwtSecret")) {
        throw new Error("FATAL ERROR: jwtPrivateKey is not defined");
    }
};
