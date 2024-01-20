const request = require("supertest");
const { User } = require("../../models/users.model.js");
const { Genre } = require("../../models/genres.model.js");

describe("auth middleware", () => {
    beforeEach(() => {
        server = require("../../index.js");
    });
    afterEach(async () => {
        await server.close();
        await Genre.deleteMany({});
    });

    let token;

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    const execute = () => {
        return request(server)
            .post("/api/genres")
            .set("x-auth-token", token)
            .send({ name: "Action" });
    };
    it("should return 401 if no token is provided", async () => {
        token = "";
        const res = await execute();
        expect(res.status).toBe(401);
    });
    it("should return 400 token is invalid", async () => {
        token = "invalid token";
        const res = await execute();
        expect(res.status).toBe(400);
    });
    it("should return 200 token is valid", async () => {
        const res = await execute();
        expect(res.status).toBe(200);
    });
});
