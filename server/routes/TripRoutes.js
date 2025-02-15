const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");

// Get trip details
router.get("/trips/:tripId", async (req, res) => {
    const { tripId } = req.params;

    try {
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ message: "Trip not found." });
        }
        res.status(200).json(trip);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching trip details." });
    }
});

module.exports = router;
