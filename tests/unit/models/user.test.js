const { User } = require("../../../models/users.model.js");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
    it("Should return valid JWT", () => {
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true,
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decodedToken = jwt.verify(token, config.get("jwtSecret"));
        expect(decodedToken).toMatchObject(payload);
    });
});
