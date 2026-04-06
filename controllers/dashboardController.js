const Property = require("../models/Property");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");

exports.getOwnerDashboard = asyncHandler(async (req, res) => {

  if (req.user.role !== "owner") {
    return res.status(403).json({ msg: "Only owners allowed" });
  }


  const properties = await Property.find({ ownerId: req.user.id }).select("_id");
  const propertyIds = properties.map(p => p._id);

 
  const stats = await Booking.aggregate([
    {
      $match: {
        propertyId: { $in: propertyIds },
      },
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: 1 },
        totalEarnings: { $sum: "$totalPrice" },
        cancelledBookings: {
          $sum: {
            $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0],
          },
        },
        activeBookings: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$status", "confirmed"] },
                  { $gte: ["$endDate", new Date()] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);


  const currentMonth = new Date().getMonth();

  const monthlyData = await Booking.aggregate([
    {
      $match: {
        propertyId: { $in: propertyIds },
      },
    },
    {
      $project: {
        totalPrice: 1,
        month: { $month: "$createdAt" },
      },
    },
    {
      $match: {
        month: currentMonth + 1,
      },
    },
    {
      $group: {
        _id: null,
        monthlyEarnings: { $sum: "$totalPrice" },
      },
    },
  ]);


  res.json({
    success: true,
    data: {
      totalProperties: properties.length,
      totalBookings: stats[0]?.totalBookings || 0,
      totalEarnings: stats[0]?.totalEarnings || 0,
      activeBookings: stats[0]?.activeBookings || 0,
      cancelledBookings: stats[0]?.cancelledBookings || 0,
      monthlyEarnings: monthlyData[0]?.monthlyEarnings || 0,
    },
  });
});