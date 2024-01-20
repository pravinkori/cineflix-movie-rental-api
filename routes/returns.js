const express = require("express");
const asyncMiddleware = require("../middleware/async.js");

const router = express.Router();

router.post(
    "/",
    asyncMiddleware(async (req, res, next) => {
        if (!req.body.customerId) {
            return res.status(400).send("customerId not provided");
        }

        if (!req.body.movieId) {
            return res.status(400).send("movieId not provided");
        }
        res.status(401).send("Unauthorized access");
    })
);

module.exports = router;
