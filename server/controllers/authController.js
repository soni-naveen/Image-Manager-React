const User = require("../models/User");
const {
  verifyPassword,
  hashPassword,
  generateToken,
  generateResetToken,
} = require("../lib/auth");

const { sendPasswordResetEmail } = require("../lib/email");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    return res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    console.log("token sent");

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (user) {
      // Generate reset token (expires in 1 hour)
      const resetToken = generateResetToken();
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Save reset token to database
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            resetToken,
            resetTokenExpiry,
          },
        }
      );

      // Send password reset email
      try {
        await sendPasswordResetEmail(email, user.name, resetToken);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        // Don't expose email sending errors to the user
      }
    }

    // Always return success message
    return res.json({
      message:
        "If an account with that email exists, we've sent a password reset link",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    return res.json({ message: "Token is valid" });
  } catch (error) {
    console.error("Verify reset token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password and clear reset token
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetToken: "",
          resetTokenExpiry: "",
        },
      }
    );

    return res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
