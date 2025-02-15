const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Optional
    comment: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
