const express = require("express");

const router = express.Router();

const {
    getPayments,
    getResidentPayments,
    createPayment,
    markPaymentAsPaid
} = require("../controllers/paymentController");


// ==========================================
// GET ALL PAYMENTS
// ==========================================
router.get(
    "/",
    getPayments
);


// ==========================================
// GET PAYMENTS FOR ONE RESIDENT
// ==========================================
router.get(
    "/resident/:residentId",
    getResidentPayments
);


// ==========================================
// CREATE PAYMENT
// ==========================================
router.post(
    "/",
    createPayment
);


// ==========================================
// MARK PAYMENT AS PAID
// ==========================================
router.put(
    "/:paymentId/pay",
    markPaymentAsPaid
);


module.exports = router;