const Booking = require("../models/Booking");
const Property = require("../models/Property");
const asyncHandler = require("../utils/asyncHandler");

const sendSMS = require("../utils/sendSMS");
exports.createBooking = asyncHandler(async (req, res) => {
  if (req.user.role !== "renter") {
    return res.status(403).json({ msg: "Only renters can book" });
  }

  const { propertyId, startDate, endDate } = req.body;

  const property = await Property.findById(propertyId);
  if (!property) {
    return res.status(404).json({ msg: "Property not found" });
  }

  // 🧮 Calculate days
  const days =
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

  if (days <= 0) {
    return res.status(400).json({ msg: "Invalid booking dates" });
  }

 
  const existingBooking = await Booking.findOne({
    propertyId,
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate },
      },
    ],
  });

  if (existingBooking) {
    return res.status(400).json({
      msg: "Property already booked for these dates",
    });
  }

  const totalPrice = days * property.price;

  const booking = await Booking.create({
    userId: req.user.id,
    propertyId,
    startDate,
    endDate,
    totalPrice,
  });

await sendSMS(
  `+91${req.user.phone}`, // ✅ India format
  `Hi ${req.user.name}, your booking for ${property.title} is confirmed 🎉`
);
  res.json({ success: true, data: booking });
});



exports.getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ userId: req.user.id })
    .populate("propertyId");

  res.json({ success: true, data: bookings });
});



exports.getOwnerBookings = asyncHandler(async (req, res) => {
  const properties = await Property.find({ ownerId: req.user.id });

  const propertyIds = properties.map(p => p._id);

  const bookings = await Booking.find({
    propertyId: { $in: propertyIds },
  }).populate("propertyId userId");

  res.json({ success: true, data: bookings });
});


exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("propertyId");

  if (!booking) {
    return res.status(404).json({ msg: "Booking not found" });
  }

  // 🔒 Only owner can update
  if (booking.propertyId.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  booking.status = req.body.status;
  await booking.save();

  res.json({ success: true, data: booking });
});