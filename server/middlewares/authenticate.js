const { verifyToken } = require("../lib/auth");

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing!",
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;

    if (!decoded) {
      return null;
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong, while validating the token",
    });
  }
};
