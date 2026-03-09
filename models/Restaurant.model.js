const { Schema, model } = require("mongoose");

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
    },

    location: {
      type: String,
      required: true,
    },

    cuisine: {
      type: String,
    },

    tables: { //maybe turn into array? to make table assignable but after finished MVP
      type: Number,
      required: true,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "owner",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Restaurant", restaurantSchema);
