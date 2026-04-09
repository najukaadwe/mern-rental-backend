const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const {
  createBookingSchema,
  updateBookingSchema,
} = require("../validators/booking.validator");

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  auth,                        // ✅ add auth
  authorize("renter"),         // 🔥 only renter
  validate(createBookingSchema),
  createBooking
);


/**
 * @swagger
 * /api/booking/user:
 *   get:
 *     summary: Get logged-in user bookings
 */
router.get(
  "/user",
  auth,
  authorize("renter"),         // 🔥 only renter
  getUserBookings
);


/**
 * @swagger
 * /api/booking/owner:
 *   get:
 *     summary: Get bookings for owner properties
 */
router.get(
  "/owner",
  auth,
  authorize("owner"),          // 🔥 only owner
  getOwnerBookings
);


/**
 * @swagger
 * /api/booking/{id}/status:
 *   put:
 *     summary: Update booking status
 */
router.put(
  "/:id",
  auth,
  authorize("owner"),          // 🔥 only owner
  validate(updateBookingSchema),
  updateBookingStatus
);

module.exports = router;