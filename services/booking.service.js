const Booking = require("../models/Booking");
const Property = require("../models/Property");
const sendSMS = require("../utils/sendSMS");

// ✅ Create Booking Service
exports.createBookingService = async (user, body) => {
  const { propertyId, startDate, endDate } = body;

  const property = await Property.findById(propertyId);
  if (!property) {
    throw new Error("Property not found");
  }

  // 🧮 Calculate days
  const days =
    (new Date(endDate) - new Date(startDate)) /
    (1000 * 60 * 60 * 24);

  if (days <= 0) {
    throw new Error("Invalid booking dates");
  }

  // ✅ Conflict check
  const existingBooking = await Booking.findOne({
    propertyId,
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
  });

  if (existingBooking) {
    throw new Error("Property already booked for these dates");
  }

  const totalPrice = days * property.price;

  const booking = await Booking.create({
    userId: user.id,
    propertyId,
    startDate,
    endDate,
    totalPrice,
  });

  // ✅ SMS (non-blocking safe)
  if (user?.phone) {
    sendSMS(
      `+91${user.phone}`,
      `Hi ${user.name}, your booking for ${property.title} is confirmed 🎉`
    ).catch(() => console.log("SMS failed"));
  }

  return booking;
};



// ✅ Get User Bookings
exports.getUserBookingsService = async (userId) => {
  return await Booking.find({ userId }).populate("propertyId");
};



// ✅ Get Owner Bookings
exports.getOwnerBookingsService = async (userId) => {
  const properties = await Property.find({ ownerId: userId });

  const propertyIds = properties.map((p) => p._id);

  return await Booking.find({
    propertyId: { $in: propertyIds },
  }).populate("propertyId userId");
};



// ✅ Update Booking Status
exports.updateBookingStatusService = async (userId, bookingId, status) => {
  const booking = await Booking.findById(bookingId)
    .populate("propertyId");

  if (!booking) {
    throw new Error("Booking not found");
  }

  // 🔒 Ownership check
  if (booking.propertyId.ownerId.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  booking.status = status;
  await booking.save();

  return booking;
};