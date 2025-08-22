const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const routes = require("./routes/index.js");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// req logging middleware
// Only using req logger in development mode only
if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}

// Routes
app.use("/api", routes);

// health route
app.use("/api/health", (req, res) => {
  res.status(200).json({
    message: "API Working...",
  });
});

module.exports = app;
