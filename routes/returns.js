const express = require("express");
const moment = require("moment");
const asyncMiddleware = require("../middleware/async.js");
const auth = require("../middleware/auth.js");
const { Rental } = require("../models/rentals.model.js");
const { Movie } = require("../models/movies.model.js");

const router = express.Router();

router.post(
    "/",
    auth,
    asyncMiddleware(async (req, res, next) => {
        if (!req.body.customerId) {
            return res.status(400).send("customerId not provided");
        }

        if (!req.body.movieId) {
            return res.status(400).send("movieId not provided");
        }

        const rental = await Rental.findOne({
            "customer._id": req.body.customerId,
            "movie._id": req.body.movieId,
        });
        if (!rental) {
            return res.status(404).send("Rental not found");
        }

        if (rental.dateReturned) {
            return res.status(400).send("Return already processed");
        }

        rental.dateReturned = new Date();
        const rentalDays = moment().diff(rental.dateOut, "days");
        rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
        await rental.save();

        await Movie.findByIdAndUpdate(
            { _id: rental.movie._id },
            { $inc: { numberInStock: 1 } }
        );
        return res.status(200).send();
    })
);

module.exports = router;
