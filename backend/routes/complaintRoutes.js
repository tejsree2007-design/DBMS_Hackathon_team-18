const express = require("express");

const router = express.Router();

const {
    getComplaints,
    createComplaint,
    updateComplaintStatus,
    deleteComplaint
} = require("../controllers/complaintController");


// ==========================================
// GET ALL COMPLAINTS
// ==========================================
router.get(
    "/",
    getComplaints
);


// ==========================================
// CREATE COMPLAINT
// ==========================================
router.post(
    "/",
    createComplaint
);


// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================
router.put(
    "/:id/status",
    updateComplaintStatus
);


// ==========================================
// DELETE COMPLAINT
// ==========================================
router.delete(
    "/:id",
    deleteComplaint
);


module.exports = router;