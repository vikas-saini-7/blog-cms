const express = require("express");
const router = express.Router();

const profileController = require("@/controller/web/profile.controller.js");
const { authenticate } = require("@/middleware/auth.middleware");

router.get("/profile", authenticate, profileController.profile);

module.exports = router;
