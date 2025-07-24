const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { authenticateUser } = require("../middlewares/auth");
const { uploadImage } = require("../controllers/imageController");

router.post("/upload", authenticateUser, upload.single("image"), uploadImage);

module.exports = router;
