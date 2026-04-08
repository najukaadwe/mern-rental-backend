const express = require("express");
const router = express.Router();

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
const auth = require("../middleware/authMiddleware");

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a booking
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             propertyId: 661234abcd1234
 *             startDate: 2026-04-01
 *             endDate: 2026-04-05
 *     responses:
 *       200:
 *         description: Booking created successfully
 */

router.post("/", validate(createBookingSchema), createBooking);

/**
 * @swagger
 * /api/booking/user:
 *   get:
 *     summary: Get logged-in user bookings
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookings
 */
router.get("/user", auth, getUserBookings);

/**
 * @swagger
 * /api/booking/owner:
 *   get:
 *     summary: Get bookings for owner properties
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of owner bookings
 */
router.get("/owner", auth, getOwnerBookings);

/**
 * @swagger
 * /api/booking/{id}/status:
 *   put:
 *     summary: Update booking status
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: confirmed
 *     responses:
 *       200:
 *         description: Booking updated
 */
router.put("/:id", validate(updateBookingSchema), updateBooking);

module.exports = router;