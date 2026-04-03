const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, createBooking);
router.get("/user", auth, getUserBookings);
router.get("/owner", auth, getOwnerBookings);
router.put("/:id/status", auth, updateBookingStatus);

module.exports = router;