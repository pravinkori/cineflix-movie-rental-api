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
        await server.close();
        await Rental.deleteMany({});
    });

    it("should return 401 if client not logged in", async () => {
        const res = await request(server).post("/api/returns").send({
            customerId: customerId,
            movieId: movieId,
        });
        expect(res.status).toBe(401);
    });
});
