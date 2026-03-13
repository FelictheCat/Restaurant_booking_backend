const router = require("express").Router();

const User = require("../models/User.model");
const { verifyToken } = require("../middlewares/auth.middlewares");

const uploader = require("../config/cloudinary.config");

router.put("/update-profile", verifyToken, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.payload._id,
      req.body,
      { new: true },
    );

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.post("/upload", verifyToken, uploader.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({ imageUrl: req.file.path });
});

module.exports = router;
