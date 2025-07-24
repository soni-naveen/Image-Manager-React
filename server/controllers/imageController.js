const Image = require("../models/Image");
const { uploadToCloudinary } = require("../lib/cloudinary");

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
      folderId: folderId ? new ObjectId(folderId) : null,
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
