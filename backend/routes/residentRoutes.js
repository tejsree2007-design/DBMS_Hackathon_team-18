const express = require("express");

const router = express.Router();

const {
    getResidents,
    deleteResident
} = require("../controllers/residentController");


// GET all residents
router.get("/", getResidents);


// DELETE resident
router.delete("/:id", deleteResident);


module.exports = router;