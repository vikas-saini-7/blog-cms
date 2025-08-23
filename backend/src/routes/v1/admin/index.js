const express = require("express");
const router = express.Router();
const { authenticate } = require("@/middleware/auth.middleware");

const blogController = require("@/controller/admin/blog.controller");

router.post("/blogs", authenticate, blogController.create);
router.post("/blogs/:id", authenticate, blogController.update);
router.get("/blogs/:id/preview", authenticate, blogController.preview);
router.post("/blogs", authenticate, blogController.list);
router.delete("/blogs/:id", authenticate, blogController.delete);

module.exports = router;
