const express = require("express");
const asyncMiddleware = require("../middleware/async.js");

const router = express.Router();

router.post(
    "/",
    asyncMiddleware(async (req, res, next) => {
        res.status(401).send("Unauthorized access");
    })
);

module.exports = router;
