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
      enum: [
        "FRENCH",
        "ITALIAN",
        "SPANISH",
        "PORTUGUESE",
        "GREEK",
        "TURKISH",
        "GERMAN",
        "BRITISH",
        "IRISH",
        "SCANDINAVIAN",

        "MEDITERRANEAN",
        "LEBANESE",
        "ISRAELI",
        "PERSIAN",

        "INDIAN",
        "PAKISTANI",
        "BANGLADESHI",

        "THAI",
        "VIETNAMESE",
        "INDONESIAN",
        "MALAYSIAN",

        "CHINESE",
        "JAPANESE",
        "KOREAN",

        "MOROCCAN",
        "ETHIOPIAN",
        "NIGERIAN",

        "AMERICAN",
        "TEX_MEX",
        "MEXICAN",

        "BRAZILIAN",
        "ARGENTINIAN",
        "PERUVIAN",

        "FUSION",
        "INTERNATIONAL",
        "STREET_FOOD",
        "BBQ",
        "SEAFOOD",
        "VEGETARIAN",
        "VEGAN",
      ],
    },

    tables: {
      //maybe turn into array? to make table assignable but after finished MVP
      type: Number,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = model("Restaurant", restaurantSchema);
