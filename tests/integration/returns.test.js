const request = require("supertest");
const moment = require("moment");
const mongoose = require("mongoose");
const { Rental } = require("../../models/rentals.model.js");
const { User } = require("../../models/users.model.js");
const { Movie } = require("../../models/movies.model.js");

describe("/api/returns", () => {
    let server;
    let rental;
    let token;
    let movie;
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

        movie = new Movie({
            _id: movieId,
            title: "Terminator",
            dailyRentalRate: 2,
            genre: { name: "Sci-fi" },
            numberInStock: 10,
        });
        await movie.save();

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
        await Movie.deleteMany({});
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

    it("should return 200 if valid request", async () => {
        const res = await execute();
        expect(res.status).toBe(200);
    });

    it("should set the returnDate if input is valid request", async () => {
        const res = await execute();
        const validRentalInDatabase = await Rental.findById(rental._id);
        const timeDifference = new Date() - validRentalInDatabase.dateReturned;
        expect(timeDifference).toBeLessThan(10 * 1000);
    });

    it("should set the returnFee if input is valid request", async () => {
        rental.dateOut = moment().add(-7, "days").toDate();
        await rental.save();
        const res = await execute();
        const validRentalInDatabase = await Rental.findById(rental._id);
        expect(validRentalInDatabase.rentalFee).toBe(14);
    });

    it("should increase the movie stock if input is valid request", async () => {
        const res = await execute();
        const validMovieInDatabase = await Movie.findById(movieId);
        expect(validMovieInDatabase.numberInStock).toBe(
            movie.numberInStock + 1
        );
    });

    it("should return the rental if input is valid request", async () => {
        const res = await execute();

        const rentalInDatabase = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining([
                "dateOut",
                "dateReturned",
                "rentalFee",
                "customer",
                "movie",
            ])
        );
    });
});
