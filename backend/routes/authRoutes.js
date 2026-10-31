const express = require("express");

const router = express.Router();

const {
    registerResident,
    loginResident,
    loginAdmin
} = require("../controllers/authController");


// Resident registration
router.post(
    "/register",
    registerResident
);


// Resident login
router.post(
    "/login",
    loginResident
);


// Admin login
router.post(
    "/admin-login",
    loginAdmin
);


module.exports = router;