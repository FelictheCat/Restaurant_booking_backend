function verifyOwner(req, res, next) {

  if (req.payload.role !== "owner") {
    return res.status(403).json({ message: "Only owners allowed" });
  }

  next();
}

module.exports = { verifyOwner };