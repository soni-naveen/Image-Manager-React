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
      filename: image.name,
      type: image.type,
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
