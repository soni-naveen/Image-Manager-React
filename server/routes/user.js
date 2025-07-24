const express = require("express");
const router = express.Router();

const { profile } = require("../controllers/userrController");
const { authenticateUser } = require("../middlewares/authenticate");

router.get("/profile", authenticateUser, profile);

module.exports = router;
