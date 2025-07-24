const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  folderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  cloudinaryPublicId: {
    type: String,
  },
  url: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  format: {
    type: String,
  },
  size: {
    type: Number,
  },
  filename: {
    type: String,
  },
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Image", ImageSchema);
module.exports = User;
