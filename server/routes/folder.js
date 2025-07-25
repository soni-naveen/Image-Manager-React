const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middlewares/auth");

const {
  createFolder,
  getRootFolder,
  getFolderContent,
  deleteFolder,
  renameFolder
} = require("../controllers/folderController");

router.post("/create", authenticateUser, createFolder);
router.get("/root", authenticateUser, getRootFolder);
router.get("/:folderId/contents", authenticateUser, getFolderContent);
router.delete("/delete", authenticateUser, deleteFolder);
router.put("/rename", authenticateUser, renameFolder);

module.exports = router;
