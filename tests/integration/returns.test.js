const request = require("supertest");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rentals.model.js");
const { User } = require("../../models/users.model.js");

describe("/api/returns", () => {
    let server;
    let rental;
    let token;
    let customerId;
    let movieId;

    const execute = async () => {
        return await request(server)
            .post("/api/returns")
            .set("x-auth-token", token)
            .send({
                customerId: customerId,
                movieId: movieId,
            });
    };

    beforeEach(async () => {
        server = require("../../index.js");
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

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
        token = "";
        const res = await execute();
        expect(res.status).toBe(401);
    });

    it("should return 400 if customerId is not provided", async () => {
        customerId = "";
        const res = await execute();
        expect(res.status).toBe(400);
    });

    it("should return 400 if movieId is not provided", async () => {
        movieId = "";
        const res = await execute();
        expect(res.status).toBe(400);
    });

    it("should return 404 if no rental found for the customer/movie", async () => {
        await Rental.deleteMany({});
        const res = await execute();
        expect(res.status).toBe(404);
    });

    it("should return 400 if return is already processed", async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await execute();
        expect(res.status).toBe(400);
    });
});
