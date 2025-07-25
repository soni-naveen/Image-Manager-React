const Image = require("../models/Image");
const { ObjectId } = require("mongodb");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../lib/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;
    const image = req.file;

    const userId = req.user.id;

    if (!name || !image) {
      return res.status(400).json({ message: "Name and image are required" });
    }

    // Upload image to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(
      image,
      `image-manager/${userId}`
    );

    const imageData = {
      name,
      userId: userId,
      folderId: folderId ? folderId : null,
      cloudinaryPublicId: cloudinaryResult.publicId,
      url: cloudinaryResult.url,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      format: cloudinaryResult.format,
      size: cloudinaryResult.bytes,
      filename: image.originalname,
      type: image.mimetype,
      createdAt: new Date(),
    };

    const newImg = new Image({ ...imageData });
    await newImg.save();

    return res.status(200).json({
      message: "Image uploaded successfully",
      image: {
        id: newImg._id,
        ...imageData,
      },
    });
  } catch (error) {
    console.error("Upload image error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { imageId } = req.body;
    const userId = req.user.id;

    if (!imageId) {
      return res.status(400).json({ message: "Image ID is required" });
    }

    // Find the image to get Cloudinary public ID
    const image = await Image.findOne({
      _id: new ObjectId(imageId),
      userId: userId,
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from Cloudinary
    if (image.cloudinaryPublicId) {
      try {
        await deleteFromCloudinary(image.cloudinaryPublicId);
      } catch (cloudinaryError) {
        console.error("Failed to delete from Cloudinary:", cloudinaryError);
      }
    }

    // Delete from database
    await Image.deleteOne({
      _id: new ObjectId(imageId),
      userId: userId,
    });

    return res.status(200).json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.searchImage = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const userId = req.user.id;

    // Search images by name (case-insensitive)
    const images = await Image.find({
      userId: userId,
      name: { $regex: query, $options: "i" },
    }).sort({ createdAt: -1 });

    return res.json(images);
  } catch (error) {
    console.error("Search images error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.renameImage = async (req, res) => {
  try {
    const userId = req.user.id;

    const { imageId, newName } = req.body;

    if (!imageId || !newName) {
      return res
        .status(400)
        .json({ message: "Image ID and new name are required" });
    }

    const trimmedName = newName.trim();
    if (!trimmedName) {
      return res.status(400).json({ message: "Image name cannot be empty" });
    }

    if (trimmedName.length > 100) {
      return res
        .status(400)
        .json({ message: "Image name cannot exceed 100 characters" });
    }

    // Verify image ownership
    const image = await Image.findOne({
      _id: new ObjectId(imageId),
      userId: userId,
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Check if an image with the same name already exists in the same folder
    const existingImage = await Image.findOne({
      name: trimmedName,
      folderId: image.folderId,
      userId: userId,
    });

    if (existingImage) {
      return res.status(400).json({
        message: "An image with this name already exists in this folder",
      });
    }

    // Update image name
    const result = await Image.updateOne(
      {
        _id: new ObjectId(imageId),
        userId: userId,
      },
      {
        $set: {
          name: trimmedName,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    return res.json({
      message: "Image renamed successfully",
      image: {
        ...image,
        name: trimmedName,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Rename image error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
