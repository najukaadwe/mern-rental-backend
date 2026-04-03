const Booking = require("../models/Booking");
const Property = require("../models/Property");


exports.createBooking = async (req, res) => {
  try {
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

    const totalPrice = days * property.price;

    const booking = await Booking.create({
      userId: req.user.id,
      propertyId,
      startDate,
      endDate,
      totalPrice,
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("propertyId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getOwnerBookings = async (req, res) => {
  try {
    const properties = await Property.find({ ownerId: req.user.id });

    const propertyIds = properties.map(p => p._id);

    const bookings = await Booking.find({
      propertyId: { $in: propertyIds },
    }).populate("propertyId userId");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateBookingStatus = async (req, res) => {
  try {
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

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};