const Folder = require("../models/Folder");
const Image = require("../models/Image");
const { ObjectId } = require("mongodb");
const { deleteFromCloudinary } = require("../lib/cloudinary");

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
      parentId: parentId ? parentId : null,
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
    const { folderId } = req.params;
    const userId = req.user.id;

    // Get subfolders
    const folders = await Folder.find({
      userId: userId,
      parentId: folderId,
    }).sort({ createdAt: -1 });

    // Get images in this folder
    const images = await Image.find({
      userId: userId,
      folderId: folderId,
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

exports.deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.body;
    const userId = req.user.id;

    if (!folderId) {
      return res.status(400).json({ message: "Folder ID is required" });
    }

    // Verify folder ownership
    const folder = await Folder.findOne({
      _id: new ObjectId(folderId),
      userId: userId,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Get all nested folder IDs recursively
    const getAllNestedFolderIds = async (parentId) => {
      const folderIds = [new ObjectId(parentId)];
      const subfolders = await Folder.find({
        parentId: parentId,
        userId: userId,
      });

      for (const subfolder of subfolders) {
        const nestedIds = await getAllNestedFolderIds(subfolder._id.toString());
        folderIds.push(...nestedIds);
      }

      return folderIds;
    };

    // Get all folder IDs to delete (including nested ones)
    const folderIdsToDelete = await getAllNestedFolderIds(folderId);
    const objectIdsToDelete = folderIdsToDelete.map(id => new ObjectId(id));

    // Get all images in these folders
    const imagesToDelete = await Image.find({
      userId: userId,
      folderId: { $in: objectIdsToDelete },
    });

    // Delete images from Cloudinary
    const cloudinaryDeletions = imagesToDelete.map(async (image) => {
      if (image.cloudinaryPublicId) {
        try {
          await deleteFromCloudinary(image.cloudinaryPublicId);
        } catch (error) {
          console.error(
            `Failed to delete image ${image.cloudinaryPublicId} from Cloudinary:`,
            error
          );
        }
      }
    });

    // Wait for all Cloudinary deletions to complete (or fail)
    await Promise.all(cloudinaryDeletions);

    // Delete images from database
    await Image.deleteMany({
      userId: userId,
      folderId: { $in: objectIdsToDelete },
    });

    // Delete all folders (including nested ones)
    await Folder.deleteMany({
      _id: { $in: objectIdsToDelete },
      userId: userId,
    });

    return res.json({
      message: "Folder and all contents deleted successfully",
      deletedFolders: objectIdsToDelete.length,
      deletedImages: imagesToDelete.length,
    });
  } catch (error) {
    console.error("Delete folder error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
