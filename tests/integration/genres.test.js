const request = require("supertest");
const mongoose = require("mongoose");
const { Genre } = require("../../models/genres.model.js");
const { User } = require("../../models/users.model.js");
let server;

describe("/api/genres", () => {
    beforeEach(() => {
        server = require("../../index.js");
    });
    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
    });
    describe("GET /", () => {
        it("should return all genres", async () => {
            const genres = [{ name: "genre1" }, { name: "genre2" }];
            await Genre.collection.insertMany(genres);

            const res = await request(server).get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
            expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
        });
    });

    describe("GET /:id", () => {
        it("should return genre if valid id is passed", async () => {
            const genre = new Genre({ name: "genre1" });
            await genre.save();

            const res = await request(server).get("/api/genres/" + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
        it("should return 404 if invalid id is passed", async () => {
            const res = await request(server).get("/api/genres/1");
            expect(res.status).toBe(404);
        });
        it("should return 404 if no genre with the given id exist", async () => {
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get("/api/genres/" + id);
            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () => {
        let token;
        let name;

        const execute = async () => {
            return await request(server)
                .post("/api/genres")
                .set("x-auth-token", token)
                .send({ name: name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = "Action";
        });

        it("should return a 401 if client is not logged in", async () => {
            token = "";
            const res = await execute();
            expect(res.status).toBe(401);
        });
        it("should return a 400 if genre is less than 5 characters", async () => {
            name = "abcd";
            const res = await execute();
            expect(res.status).toBe(400);
        });
        it("should return a 400 if genre is more than 50 characters", async () => {
            name = new Array(52).join("a");
            const res = await execute();
            expect(res.status).toBe(400);
        });

        it("should save the genre if it is valid", async () => {
            await execute();
            const genre = await Genre.find({ name: "Action" });
            expect(genre).not.toBeNull();
        });
        it("should return the genre if it is valid", async () => {
            const res = await execute();
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", "Action");
        });
    });

    describe("PUT /:id", () => {
        let token;
        let newName;
        let genre;
        let id;

        const execute = async () => {
            return await request(server)
                .put("/api/genres/" + id)
                .set("x-auth-token", token)
                .send({ name: newName });
        };

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({ name: "genre1" });
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = "updatedName";
        });

        it("should return 401 if client is not logged in", async () => {
            token = "";

            const res = await execute();

            expect(res.status).toBe(401);
        });

        it("should return 400 if genre is less than 5 characters", async () => {
            newName = "1234";

            const res = await execute();

            expect(res.status).toBe(400);
        });
    });
});
