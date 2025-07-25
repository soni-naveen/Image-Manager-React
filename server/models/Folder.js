const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("Folder", FolderSchema);
module.exports = User;
