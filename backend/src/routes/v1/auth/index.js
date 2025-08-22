const express = require("express");
const router = express.Router();

const authController = require("@/controller/auth/auth.controller.js");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

module.exports = router;
