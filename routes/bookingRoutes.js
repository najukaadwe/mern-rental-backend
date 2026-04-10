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
 * tags:
 *   name: Booking
 *   description: Booking management APIs
 */


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
 *             propertyId: "64abc123456"
 *             startDate: "2025-01-01"
 *             endDate: "2025-01-05"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid data
 */
router.post(
  "/",
  auth,
  authorize("renter"),
  validate(createBookingSchema),
  createBooking
);


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
 *         description: User bookings fetched
 */
router.get(
  "/user",
  auth,
  authorize("renter"),
  getUserBookings
);


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
 *         description: Owner bookings fetched
 */
router.get(
  "/owner",
  auth,
  authorize("owner"),
  getOwnerBookings
);


/**
 * @swagger
 * /api/booking/{id}:
 *   put:
 *     summary: Update booking status
 *     tags: [Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             status: "approved"
 *     responses:
 *       200:
 *         description: Booking status updated
 *       404:
 *         description: Booking not found
 */
router.put(
  "/:id",
  auth,
  authorize("owner"),
  validate(updateBookingSchema),
  updateBookingStatus
);

module.exports = router;