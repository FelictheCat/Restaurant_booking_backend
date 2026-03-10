const router = require("express").Router();

const Restaurant = require("../models/Restaurant.model");

const { verifyToken } = require("../middlewares/auth.middlewares");

const { verifyOwner } = require("../middlewares/role.middleware");

const uploader = require("../config/cloudinary.config");

router.post("/", verifyToken, verifyOwner, async (req, res, next) => {
  const { name, location, cuisine, tables, images } = req.body;

  try {
    const newRestaurant = await Restaurant.create({
      name,
      location,
      cuisine,
      tables,
      images,
      owner: req.payload._id,
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().populate("owner");

    res.json(restaurants);
  } catch (error) {
    next(error);
  }
});

router.get("/my-restaurants", verifyToken, verifyOwner, async (req, res, next) => {
          try {
            const restaurants = await Restaurant.find({
              owner: req.payload._id,
            });
      
            res.json(restaurants);
          } catch (error) {
            next(error);
          }
        },
      );

router.get("/:restaurantId", async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    const restaurant =
      await Restaurant.findById(restaurantId).populate("owner");

    res.json(restaurant);
  } catch (error) {
    next(error);
  }
});

router.put("/:restaurantId", verifyToken, verifyOwner, async (req, res, next) => {
    const { restaurantId } = req.params;

    try {
      const restaurant = await Restaurant.findById(restaurantId);

      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // ownership check
      if (!restaurant.owner.equals(req.payload._id)) {
        return res.status(403).json({ message: "Not your restaurant" });
      }

      const updatedRestaurant = await Restaurant.findByIdAndUpdate(
        restaurantId,
        req.body,
        { new: true },
      );

      res.json(updatedRestaurant);
      
    } catch (error) {
      next(error);
    }
  },
);


router.delete("/:restaurantId", verifyToken, verifyOwner, async (req, res, next) => {
    const { restaurantId } = req.params;

    try {
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (!restaurant.owner.equals(req.payload._id)) {
      return res.status(403).json({ message: "Not your restaurant" });
    }
      await Restaurant.findByIdAndDelete(restaurantId);

      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

router.post("/upload", verifyToken, verifyOwner, uploader.single("image"),
  (req, res, next) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    res.json({
      imageUrl: req.file.path,
    });
  },
);

module.exports = router;
