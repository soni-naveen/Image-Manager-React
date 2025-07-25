const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-token", verifyResetToken);
router.post("/reset-password", resetPassword);

module.exports = router;
