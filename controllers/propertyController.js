const Property = require("../models/Property");


exports.addProperty = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ msg: "Only owners can add property" });
    }

    const property = await Property.create({
      ...req.body,
      ownerId: req.user.id,
    });

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate("ownerId", "name email");
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("ownerId", "name");
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ msg: "Not found" });

    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ msg: "Not found" });

    if (property.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await property.deleteOne();

    res.json({ msg: "Property deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};