const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { verifyToken } = require("../middlewares/auth.middlewares");

router.post("/signup", async (req, res, next) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    res.status(400).json({ errorMessage: "All fields required" });
    return;
  }

  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/gm;
  if (passwordRegex.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "Password must follow this pattern (min 8 characters, max 20 characters, include lowercase, include uppercase, include number)",
    });
    return; 
  }

  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      res.status(400).json({
        errorMessage: "That email is already in use by another account",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const response = await User.create({
      email: email,
      password: hashedPassword,
      username: username,
    });

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: "All fields required (email, password)" });
    return;
  }

  try {
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      res.status(400).json({ errorMessage: "User not found, please sign up" });
      return;
    }

    const passwordCorrect = await bcrypt.compare(password, foundUser.password);

    if (!passwordCorrect) {
      res.status(400).json({ errorMessage: "Password incorrect" });
      return;
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
    };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    res.status(200).json({
      authToken,
      payload,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json({ payload: req.payload });
});

module.exports = router;
