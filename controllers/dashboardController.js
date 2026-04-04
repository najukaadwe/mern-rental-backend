const Property = require("../models/Property");
const Booking = require("../models/Booking");

exports.getOwnerDashboard = async (req, res) => {
  try {

    if (req.user.role !== "owner") {
      return res.status(403).json({ msg: "Only owners allowed" });
    }

   
    const properties = await Property.find({ ownerId: req.user.id });

    const propertyIds = properties.map(p => p._id);

  
    const bookings = await Booking.find({
      propertyId: { $in: propertyIds },
    });

    
    const totalProperties = properties.length;
    const totalBookings = bookings.length;

    const totalEarnings = bookings.reduce(
      (sum, b) => sum + (b.totalPrice || 0),
      0
    );

    res.json({
      totalProperties,
      totalBookings,
      totalEarnings,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};