const User = require("../models/User");

exports.profile = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
