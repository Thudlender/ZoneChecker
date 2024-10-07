const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT;
const frontend_url = process.env.FRONTEND_URL;
const corsOption = {
    origin: frontend_url,
};
//List of stores
const stores = require("./stores")
//console.log(stores);
const app = express();
app.use(cors(corsOption));

//get all stores
app.get("/api/stores", (req, res) => {
    res.json(stores);
});

//Homepage
app.get("/", (req, res) => {
    res.send("<h1>Welcome to API for Store Delivery Zone Checker</h1>");
});

app.listen(PORT, () => {
    console.log("Server running on port http://localhost:" + PORT);
});


