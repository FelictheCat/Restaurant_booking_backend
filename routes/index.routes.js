const router = require("express").Router();

const authRouter = require("./auth.routes");
router.use("/auth", authRouter);

const restaurantRouter = require("./restaurant.routes");
router.use("/restaurants", restaurantRouter);


module.exports = router;
