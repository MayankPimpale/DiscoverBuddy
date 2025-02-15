const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { body } = require("express-validator");
const authenticateToken = require("../middleware/authenticateToken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

const Trip = require("../models/Trip"); 

//signup
router.post(
  "/signup",
  [
    body("username", "Name is required").not().isEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // console.log("Request body:", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // console.log("Validation errors:", errors.array()); // Log validation errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const normalizedEmail = email.toLowerCase();
      let userByUsername = await User.findOne({ username });
      if (userByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      let user = await User.findOne({ email: normalizedEmail });
      if (user)
        return res
          .status(400)
          .json({
            message: "User with this email already exists , Please Login",
          });

      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({ username, email, password: hashedPassword });
      const savedUser = await user.save();
      // console.log("User saved successfully:", savedUser);

      const token = jwt.sign(
        { userId: savedUser._id, email: savedUser.email },
        JWT_SECRET,
        { expiresIn: "1d" }
      );
      res
        .status(201)
        .json({
          message: " User resgistered successfully",
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
          },
          token,
        });
      // console.log("JWT_SECRET:", process.env.JWT_SECRET);
      // console.log("MONGO_URI:", process.env.MONGO_URI);
    } catch (error) {
      // console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .status(200)
      .json({
        token,
        user: { username: user.username, email: user.email },
        message: "Token received",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Get user Profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    //console.log(data.email);
    //let user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//ADD TRIP
router.post(
  "/add-trip",
  authenticateToken,
  upload.fields([{ name: "images", maxCount: 10 }, { name: "videos", maxCount: 5 }]),
  async (req, res) => {
    try {
      // console.log("Request body:", req.body); // Log request body
      // console.log("Authenticated user:", req.user); // Log authenticated user
      // console.log("Files uploaded:", req.files); // Log uploaded files

      const { name, description, category, duration, rating } = req.body;

      const locations = req.body.locations ? JSON.parse(req.body.locations) : [];
      // const captions = req.body.captions ? JSON.parse(req.body.captions) : {};

      const images = req.files["images"]?.map((file) => ({
        url: `/uploads/${file.filename}`,
        // caption: captions[file.originalname] || "",
      }));

      const videos = req.files["videos"]?.map((file) => `/uploads/${file.filename}`);

      const newTrip = new Trip({
        name,
        description,
        category,
        duration,
        rating,
        locations,
        images,
        videos,
      });

      await newTrip.save();
      res.status(201).json({ message: "Trip added successfully" });
    } catch (err) {
      console.error("Error in /add-trip:", err); // Log detailed error
      res.status(500).json({ message: "Failed to add trip", error: err.message });
    }
  }
);

//Get all trips
router.get("/trips", async (req, res) => {
  try {
    console.log("Fetching trips from database...");
    const trips = await Trip.find().sort({ createdAt: -1 }); // Fetch trips sorted by newest first
    res.status(200).json({ trips });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching trips", error: error.message });
  }
});

//DELETE TRIP
router.delete("/trips/:id", authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.userId; // Obtained from `authenticateToken`

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this trip" });
    }

    await trip.remove();
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
