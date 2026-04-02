const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    location: String,
    images: [String],
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model("Property", propertySchema);