const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const databaseDebugger = require("debug")("app:database");
const dotenv = require("dotenv").config();
const home = require("./routes/home.js");
const genres = require("./routes/genres.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// routes
app.use("api/genres", genres);
app.use("/", home);

if (app.get("env") === "development") {
    app.use(morgan("dev"));
    startupDebugger("Morgan logger enabled...");
    databaseDebugger("Connected to database...");
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`listening on port http://localhost:${port}`);
});
