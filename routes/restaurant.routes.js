const router = require("express").Router();

const Restaurant = require("../models/Restaurant.model");

const { verifyToken } = require("../middlewares/auth.middlewares");

router.post("/", verifyToken, async (req, res, next) => {
  const { name, location, cuisine, tables } = req.body;

  try {
    const newRestaurant = await Restaurant.create({
      name,
      location,
      cuisine,
      tables,
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

router.put("/:restaurantId", verifyToken, async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      req.body,
      { new: true },
    );

    res.json(updatedRestaurant);
  } catch (error) {
    next(error);
  }
});

router.delete("/:restaurantId", verifyToken, async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    await Restaurant.findByIdAndDelete(restaurantId);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;