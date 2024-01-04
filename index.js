const express = require("express");
const Joi = require("joi");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
