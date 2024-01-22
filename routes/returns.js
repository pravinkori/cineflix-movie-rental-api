const express = require("express");
const Joi = require("joi");
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
        const { error } = validateReturn(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
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
        return res.status(200).send(rental);
    })
);

function validateReturn(req) {
    const schema = Joi.object({
        customerId: Joi.string().required(),
        movieId: Joi.string().required(),
    });
    return schema.validate(req);
}

module.exports = router;
