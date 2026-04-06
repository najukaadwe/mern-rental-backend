const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },


    userName: {
      type: String,
      trim: true,
    },

  
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },

 
    propertyTitle: {
      type: String,
      trim: true,
    },

  
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },


    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be greater than start date",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },


    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },


    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },


    notes: {
      type: String,
      maxlength: 300,
    },


    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


bookingSchema.index({ userId: 1 });
bookingSchema.index({ propertyId: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);