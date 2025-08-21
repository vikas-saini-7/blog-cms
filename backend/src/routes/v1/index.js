const express = require("express");
const router = express.Router();

const authRoutes = require("./auth/index.js");
const webRoutes = require("./web/index.js");
const adminRoutes = require("./admin/index.js");

router.use("/auth", authRoutes);
router.use("/web", webRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
