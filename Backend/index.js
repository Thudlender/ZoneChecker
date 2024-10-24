const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const map = require("./routers/Map");
const authRouter = require("./routers/auth.router");
const db = require("./models/");
const role = db.Role;
const cors = require("cors");

// List of stores
const stores = require("./stores");

// CORS
app.use(cors());

// Initialize roles
const initRole = () => {
    role.create({ id: 1, name: "user" });
    role.create({ id: 2, name: "moderator" });
    role.create({ id: 3, name: "admin" });
};

// Dev mode (drop and re-sync database)
db.sequelize.sync({ force: false }).then(() => {
    // initRole();
    console.log("Drop and Sync DB");
});

// Homepage
app.get("/", (req, res) => {
    res.send("<h1>Welcome to API for Store Delivery Zone Checker</h1>");
});

// Use routers
app.use("/api/v1/maps", map);
app.use("/api/v1/auth", authRouter);

// Get all stores
app.get("/api/stores", (req, res) => {
    res.json(stores);
});

// Start server
app.listen(PORT, () => {
    console.log("Server running on port http://localhost:" + PORT);
});
