const router = require("express").Router();

const Booking = require("../models/Booking.model");
const Restaurant = require("../models/Restaurant.model")

const { verifyToken } = require("../middlewares/auth.middlewares");

router.post("/", verifyToken, async (req, res, next) => {
  const { restaurant, date, guests } = req.body;

  try {
    const newBooking = await Booking.create({
      customer: req.payload._id,
      restaurant,
      date,
      guests,
    });
    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
});

router.get("/my-bookings", verifyToken, async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      customer: req.payload._id,
    }).populate("restaurant");

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get("/restaurant/:restaurantId", verifyToken, async (req, res, next) => {
  const { restaurantId } = req.params;

  try {
    const bookings = await Booking.find({
      restaurant: restaurantId,
    }).populate("customer");

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.put("/:bookingId/assign", verifyToken, async (req, res, next) => {
  const { bookingId } = req.params;
  const { tableNumber } = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        tableNumber,
        status: "assigned",
      },
      { new: true },
    );

    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
});

router.put("/:bookingId/cancel", verifyToken, async (req, res, next) => {
  const { bookingId } = req.params;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "cancelled" },
      { new: true },
    );

    res.json(updatedBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;