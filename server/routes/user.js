const express = require("express");
const router = express.Router();

const { profile } = require("../controllers/userController");
const { authenticateUser } = require("../middlewares/auth");

router.get("/profile", authenticateUser, profile);

module.exports = router;
