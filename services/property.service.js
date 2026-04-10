const Property = require("../models/Property");


// ✅ Add Property
exports.addPropertyService = async (userId, body, files) => {
  const imagePaths =
    files?.map((file) => `/uploads/${file.filename}`) || [];

  const property = await Property.create({
    ...body,
    images: imagePaths,
    ownerId: userId,
  });

  return property;
};



// ✅ Get Properties (Pagination + Filtering)
exports.getPropertiesService = async (query) => {
  const {
    location,
    minPrice,
    maxPrice,
    page = 1,
    limit = 5,
    sort = "createdAt",
  } = query;

  let filter = { isDeleted: false };

  // 🔍 Location search
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

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: properties,
  };
};



// ✅ Get Single Property
exports.getPropertyService = async (id) => {
  const property = await Property.findById(id)
    .populate("ownerId", "name email");

  if (!property || property.isDeleted) {
    throw new Error("Property not found");
  }

  return property;
};



// ✅ Update Property
exports.updatePropertyService = async (userId, propertyId, body) => {
  const property = await Property.findById(propertyId);

  if (!property || property.isDeleted) {
    throw new Error("Property not found");
  }

  // 🔒 Ownership check
  if (property.ownerId.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  const updated = await Property.findByIdAndUpdate(
    propertyId,
    body,
    { new: true, runValidators: true }
  );

  return updated;
};



// ✅ Delete Property (Soft Delete)
exports.deletePropertyService = async (userId, propertyId) => {
  const property = await Property.findById(propertyId);

  if (!property || property.isDeleted) {
    throw new Error("Property not found");
  }

  // 🔒 Ownership check
  if (property.ownerId.toString() !== userId) {
    const err = new Error("Not authorized");
    err.statusCode = 403;
    throw err;
  }

  property.isDeleted = true;
  await property.save();

  return true;
};