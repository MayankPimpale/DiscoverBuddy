const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Trip = require("../models/Trip");
const authenticateToken = require("../middleware/authenticateToken");

// Add a comment to a trip
router.post("/trips/:tripId/comments", authenticateToken,async (req, res) => {
    const { tripId } = req.params;
    const { comment } = req.body;
    const {userId} = req.user;
    const { username } = req.body; 
    if (!comment || !userId) {
        return res.status(400).json({ message: "Comment and userId are required." });
    }

    try {
        // Ensure the trip exists
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }

        // Create and save the comment
        const newComment = new Comment({ tripId, userId,username, comment });
        await newComment.save();
        res.status(201).json({ message: "Comment added successfully.", comment: newComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding comment." });
    }
});

// Get all comments for a trip
router.get("/trips/:tripId/comments", async (req, res) => {
    const { tripId } = req.params;

    try {
        const comments = await Comment.find({ tripId }).populate("userId", "username"); 
        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching comments." });
    }
});

module.exports = router;
