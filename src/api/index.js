const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const corsMiddleware = require("./middleware/corsMiddleware");
const rephraseRoutes = require("./routes/rephraseRoutes");

const app = express();
app.use(corsMiddleware());
app.use(express.json());

app.use("/api/rephrase", rephraseRoutes);

module.exports = app;
