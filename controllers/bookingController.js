const asyncHandler = require("../utils/asyncHandler");
const bookingService = require("../services/booking.service");


// ✅ Create Booking
exports.createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBookingService(
    req.user,
    req.body
  );

  res.status(201).json({
    success: true,
    msg: "Booking created successfully",
    data: booking,
  });
});


// ✅ Get User Bookings
exports.getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getUserBookingsService(
    req.user.id
  );

  res.json({
    success: true,
    data: bookings,
  });
});


// ✅ Get Owner Bookings
exports.getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await bookingService.getOwnerBookingsService(
    req.user.id
  );

  res.json({
    success: true,
    data: bookings,
  });
});


// ✅ Update Booking Status
exports.updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatusService(
    req.user.id,
    req.params.id,
    req.body.status
  );

  res.json({
    success: true,
    msg: "Booking status updated",
    data: booking,
  });
});