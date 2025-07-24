const express = require("express");
const dbConnect = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cors = require("cors");
require("dotenv").config();

//Connect to database
dbConnect.database();

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Setting up routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running perfectly...",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
