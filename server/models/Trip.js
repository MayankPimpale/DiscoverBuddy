const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    locations: { type: [String], default: [] },
    images: [
        {
            url: { type: String, required: true },
            caption: { type: String, default: "" },
        },
    ],
    videos: { type: [String], default: [] },
});

module.exports = mongoose.model("Trip", TripSchema);
