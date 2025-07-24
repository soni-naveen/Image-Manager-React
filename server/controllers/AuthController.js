const clientPromise = require("../config/database");
const { verifyPassword, hashPassword, generateToken } = require("../lib/auth");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = await req.body;

    if (!name || !email || !password) {
      return res.json({ message: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("imagemanager");

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" }, { status: 400 });
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Generate token
    const token = generateToken(result.insertedId.toString());

    return res.json({
      message: "User created successfully",
      token,
      user: {
        id: result.insertedId,
        name,
        email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = await req.body;

    if (!email || !password) {
      return res.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("imagemanager");

    // Find user
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.json({ message: "Invalid credentials" }, { status: 401 });
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
    return res.json({ message: "Internal server error" }, { status: 500 });
  }
};
