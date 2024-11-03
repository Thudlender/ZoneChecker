const express = require("express");
const app = express();
require("dotenv").config(".env");
const PORT = process.env.PORT || 5000;
const map = require("./routers/Map");
const authRouter = require("./routers/auth.router");
const db = require("./models/");
const role = db.Role
const cors = require("cors");

// List of stores
const stores = require("./stores");


// Dev mode (drop and re-sync database)
//   db.sequelize.sync({ force: true }).then(() => {
//   initRole();
//   console.log("Drop and re-sync db.");
// });

// Initialize roles
  const initRole = () => {
    role.create({
      id: 1,
      name: "user",
    });
    role.create({
      id: 2,
      name: "moderator",
    });
    role.create({
      id: 3,
      name: "admin",
    });
  };

// CORS Middleware
app.use(cors({ origin: "http://localhost:5173" })); // อนุญาต CORS ให้กับ localhost:5173

//use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get all stores
app.get("/api/stores", (req, res) => {
    res.json(stores);
});

  //use Router
  app.use("/api/v1/maps", map);
app.use("/api/v1/auth", authRouter);

// Homepage
  app.get("/", (req, res) => {
    res.send("<h1>Hello Store derivery API</h1>");
  });

  // Start server
  app.listen(PORT, () => {
    console.log("Listenning to http://localhost/:" + PORT);
  });