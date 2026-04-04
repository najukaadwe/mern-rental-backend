const Property = require("../models/Property");
const Booking = require("../models/Booking");

exports.getOwnerDashboard = async (req, res, next) => {
  try {
    // 🔒 Only owner allowed
    if (req.user.role !== "owner") {
      return res.status(403).json({ msg: "Only owners allowed" });
    }

    // 🏠 Get properties
    const properties = await Property.find({ ownerId: req.user.id });
    const propertyIds = properties.map(p => p._id);

    // 📅 Get bookings
    const bookings = await Booking.find({
      propertyId: { $in: propertyIds },
    });

    // 📊 Basic stats
    const totalProperties = properties.length;
    const totalBookings = bookings.length;

    const totalEarnings = bookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );

    // 🔥 ADVANCED METRICS

    // ✅ Active bookings
    const activeBookings = bookings.filter(
      b => b.status === "confirmed" && new Date(b.endDate) >= new Date()
    ).length;

    // ❌ Cancelled bookings
    const cancelledBookings = bookings.filter(
      b => b.status === "cancelled"
    ).length;

    // 💰 Monthly earnings
    const currentMonth = new Date().getMonth();
    const monthlyEarnings = bookings
      .filter(b => new Date(b.createdAt).getMonth() === currentMonth)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // 📤 Response
    res.json({
      success: true,
      data: {
        totalProperties,
        totalBookings,
        totalEarnings,
        activeBookings,
        cancelledBookings,
        monthlyEarnings,
      },
    });

  } catch (error) {
    next(error); // ✅ middleware handling
  }
};