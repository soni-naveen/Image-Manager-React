const { authenticateUser } = require("../middlewares/authenticate");

exports.profile = async (req, res) => {
  try {
    const user = await authenticateUser(req);

    if (!user) {
      return res.json({ message: "Unauthorized" }, { status: 401 });
    }

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};
