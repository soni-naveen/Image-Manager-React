const Folder = require("../models/Folder");
const Image = require("../models/Image");

exports.createFolder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const folderData = {
      name,
      userId: userId,
      parentId: parentId ? new ObjectId(parentId) : null,
      createdAt: new Date(),
    };

    const newFolder = new Folder({ ...folderData });
    await newFolder.save();

    return res.status(200).json({
      message: "Folder created successfully",
      folder: {
        id: newFolder._id,
        ...folderData,
      },
    });
  } catch (error) {
    console.error("Create folder error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRootFolder = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get root folders (parentId is null)
    const folders = await Folder.find({
      userId: userId,
      parentId: null,
    }).sort({ createdAt: -1 });

    // Get root images (folderId is null)
    const images = await Image.find({ userId: userId, folderId: null }).sort({
      createdAt: -1,
    });

    return res.json({
      folders,
      images,
    });
  } catch (error) {
    console.error("Get root contents error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getFolderContent = async (req, res) => {
  try {
    const { folderId } = req.params.id;
    const userId = req.user.id;

    console.log("Fetching contents for folder:", folderId);

    // Get subfolders
    const folders = await Folder.find({
      userId: userId,
      parentId: new ObjectId(folderId),
    }).sort({ createdAt: -1 });

    // Get images in this folder
    const images = await Image.find({
      userId: userId,
      folderId: new ObjectId(folderId),
    }).sort({ createdAt: -1 });

    return res.json({
      folders,
      images,
    });
  } catch (error) {
    console.error("Get folder contents error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteFolder = async (req, res) => {};
