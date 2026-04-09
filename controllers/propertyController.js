const Property = require("../models/Property");
const asyncHandler = require("../utils/asyncHandler");


// ✅ Add Property (role handled by middleware)
exports.addProperty = asyncHandler(async (req, res) => {
  const imagePaths = req.files?.map(file => `/uploads/${file.filename}`) || [];

  const property = await Property.create({
    ...req.body,
    images: imagePaths,
    ownerId: req.user.id,
  });

  res.status(201).json({
    success: true,
    msg: "Property created successfully",
    data: property,
  });
});



// ✅ Get Properties (Pagination + Filtering)
exports.getProperties = asyncHandler(async (req, res) => {
  const {
    location,
    minPrice,
    maxPrice,
    page = 1,
    limit = 5,
    sort = "createdAt",
  } = req.query;

  let filter = {};

  // 🔍 Search by location
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  // 💰 Price filter
  if (minPrice && maxPrice) {
    filter.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
  }

  const properties = await Property.find(filter)
    .populate("ownerId", "name email")
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Property.countDocuments(filter);

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: properties,
  });
});



// ✅ Get Single Property
exports.getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate("ownerId", "name email");

  if (!property) {
    return res.status(404).json({ msg: "Property not found" });
  }

  res.json({
    success: true,
    data: property,
  });
});



// ✅ Update Property (ownership check remains)
exports.updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ msg: "Property not found" });
  }

  // 🔒 Ownership check (IMPORTANT)
  if (property.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  const updated = await Property.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    msg: "Property updated successfully",
    data: updated,
  });
});



// ✅ Delete Property (Soft delete + ownership check)
exports.deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({ msg: "Property not found" });
  }

  // 🔒 Ownership check
  if (property.ownerId.toString() !== req.user.id) {
    return res.status(403).json({ msg: "Not authorized" });
  }

  property.isDeleted = true;
  await property.save();

  res.json({
    success: true,
    msg: "Property deleted successfully",
  });
});