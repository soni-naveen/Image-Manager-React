const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const { authenticateUser } = require("../middlewares/auth");
const {
  uploadImage,
  deleteImage,
  searchImage,
  renameImage
} = require("../controllers/imageController");

router.post("/upload", authenticateUser, upload.single("image"), uploadImage);
router.delete("/delete", authenticateUser, deleteImage);
router.get("/search", authenticateUser, searchImage);
router.put("/rename", authenticateUser, renameImage);

module.exports = router;
