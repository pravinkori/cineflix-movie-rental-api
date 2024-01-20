const request = require("supertest");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rentals.model.js");

describe("/api/returns", () => {
    let server;
    let rental;
    let customerId;
    let movieId;

    beforeEach(async () => {
        server = require("../../index.js");
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "Reacher",
                phone: "12345",
            },
            movie: {
                _id: movieId,
                title: "Avengers",
                dailyRentalRate: 2,
            },
        });
        await rental.save();
    });
    afterEach(async () => {
        server.close();
        await Rental.deleteMany({});
    });

    it("Should work", async () => {
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });
});
