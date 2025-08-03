const express = require("express");
const userRoutes = require("./routes/user.routes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);

// health route
app.use("/api/health", (req, res) => {
  res.status(200).json({
    message: "API Working...",
  });
});

module.exports = app;
