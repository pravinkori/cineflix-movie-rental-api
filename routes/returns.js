const express = require("express");
const Joi = require("joi");
const moment = require("moment");
const asyncMiddleware = require("../middleware/async.js");
const auth = require("../middleware/auth.js");
const validate = require("../middleware/validate.js");
const { Rental } = require("../models/rentals.model.js");
const { Movie } = require("../models/movies.model.js");

const router = express.Router();

router.post(
    "/",
    [auth, validate(validateReturn)],
    asyncMiddleware(async (req, res, next) => {
        const rental = await Rental.lookup(
            req.body.customerId,
            req.body.movieId
        );

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
