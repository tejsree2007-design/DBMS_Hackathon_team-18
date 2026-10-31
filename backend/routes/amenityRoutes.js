const express = require("express");

const router = express.Router();

const {
    getAmenities,
    createAmenity,
    getAmenityBookings,
    createAmenityBooking,
    deleteAmenityBooking,
    deleteAmenity
} = require("../controllers/amenityController");


// ==========================================
// AMENITIES
// ==========================================

router.get(
    "/",
    getAmenities
);

router.post(
    "/",
    createAmenity
);

router.delete(
    "/:id",
    deleteAmenity
);


// ==========================================
// AMENITY BOOKINGS
// ==========================================

router.get(
    "/bookings",
    getAmenityBookings
);

router.post(
    "/bookings",
    createAmenityBooking
);

router.delete(
    "/bookings/:id",
    deleteAmenityBooking
);


module.exports = router;