require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes.js");
const tripRoutes = require("./routes/TripRoutes.js");
const multer = require("multer");
const Trip = require("./models/Trip.js");
const path = require("path");

const app = express();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be saved to the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName); // Save file with a unique name
  },
});
const upload = multer({ storage: storage });

app.use(cors({
  origin: 'https://discoverbuddy.onrender.com',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  credentials: true,
}));

const _dirname = path.resolve();
app.use(express.json());

// ✅ API Routes (Move these above the wildcard route)
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", authRoutes);
app.use("/api", tripRoutes);
app.use("/api", commentRoutes);

// ✅ Serve static files from React
app.use(express.static(path.join(_dirname, "/client/build")));

// ✅ This wildcard route should be last!
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, "client", "build", "index.html"));
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected"))
  .catch(err => console.error("Connection failed", err));

// ✅ Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
