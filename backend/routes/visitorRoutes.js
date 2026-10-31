const express = require("express");

const router = express.Router();

const {
    getVisitors,
    createVisitor,
    deleteVisitor
} = require("../controllers/visitorController");

// GET all visitors
router.get("/", getVisitors);

// CREATE visitor
router.post("/", createVisitor);

// DELETE visitor
router.delete("/:id", deleteVisitor);

module.exports = router;