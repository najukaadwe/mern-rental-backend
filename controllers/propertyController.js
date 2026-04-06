const Property = require("../models/Property");

// ✅ ADD PROPERTY
exports.addProperty = async (req, res, next) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ msg: "Only owners can add property" });
    }

    const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
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

  } catch (error) {
    next(error);
  }
};


// ✅ GET ALL PROPERTIES (WITH SEARCH + PAGINATION)
exports.getProperties = async (req, res, next) => {
  try {
    const { location, minPrice, maxPrice, page = 1, limit = 5 } = req.query;

    let filter = {};

    // 🔍 Search by location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    // 💰 Price filter
    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    const properties = await Property.find(filter)
      .populate("ownerId", "name email")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      total,
      page: Number(page),
      data: properties,
    });

  } catch (error) {
    next(error);
  }
};


// ✅ GET SINGLE PROPERTY
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "ownerId",
      "name email"
    );

    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }

    res.json({ success: true, data: property });

  } catch (error) {
    next(error);
  }
};


// ✅ UPDATE PROPERTY
exports.updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }

    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // 🔥 important
    );

    res.json({
      success: true,
      msg: "Property updated",
      data: updated,
    });

  } catch (error) {
    next(error);
  }
};


// ✅ DELETE PROPERTY
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ msg: "Property not found" });
    }

    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await property.deleteOne();

    res.json({
      success: true,
      msg: "Property deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};