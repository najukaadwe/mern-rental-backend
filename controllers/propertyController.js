const asyncHandler = require("../utils/asyncHandler");
const propertyService = require("../services/property.service");


// ✅ Add Property
exports.addProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.addPropertyService(
    req.user.id,
    req.body,
    req.files
  );

  res.status(201).json({
    success: true,
    msg: "Property created successfully",
    data: property,
  });
});



// ✅ Get Properties
exports.getProperties = asyncHandler(async (req, res) => {
  const result = await propertyService.getPropertiesService(req.query);

  res.json({
    success: true,
    ...result,
  });
});



// ✅ Get Single Property
exports.getProperty = asyncHandler(async (req, res) => {
  const property = await propertyService.getPropertyService(
    req.params.id
  );

  res.json({
    success: true,
    data: property,
  });
});



// ✅ Update Property
exports.updateProperty = asyncHandler(async (req, res) => {
  const updated = await propertyService.updatePropertyService(
    req.user.id,
    req.params.id,
    req.body
  );

  res.json({
    success: true,
    msg: "Property updated successfully",
    data: updated,
  });
});



// ✅ Delete Property
exports.deleteProperty = asyncHandler(async (req, res) => {
  await propertyService.deletePropertyService(
    req.user.id,
    req.params.id
  );

  res.json({
    success: true,
    msg: "Property deleted successfully",
  });
});