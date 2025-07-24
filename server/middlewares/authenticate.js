const { verifyToken } = require("../lib/auth");
const clientPromise = require("../config/database");

export async function authenticateUser(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  const client = await clientPromise;
  const db = client.db("imagemanager");
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(decoded.userId) });

  return user;
}
