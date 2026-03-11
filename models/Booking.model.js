const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
    {
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  restaurant: {
    type: Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  guests: {
    type: Number,
    required: true
  },

  tableNumber: {
    type: Number,
    default: null
  },

  status: {
    type: String,
    enum: ["requested", "assigned", "cancelled", "finished"],//array for finished to be pushed to look at code from last project -- arrays for visaul front end -- if cant work out in time just change status to confirmed 
    default: "requested"
  }

},
{
  timestamps: true
}
);

module.exports = model("Booking", bookingSchema);
