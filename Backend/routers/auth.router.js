const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifySignUp} = require("../middleware");

router.use((req, res, next) =>{
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, origin, Content-Type, Accept"
    );
    next();
});
router.post(
    "/signup",
    // [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    authController.signup
);

router.post("/signin", authController.signin);

module.exports = router;