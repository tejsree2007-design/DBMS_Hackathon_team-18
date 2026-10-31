const db = require("../config/db");

// ==========================================
// GET ALL PAYMENTS
// ==========================================
const getPayments = (req, res) => {

    const sql = `
        SELECT
            p.payment_id,
            p.resident_id,
            u.name,
            r.flat_number,
            p.amount,
            p.payment_month,
            p.payment_status,
            p.payment_method,
            p.transaction_reference,
            p.paid_at
        FROM payments p
        JOIN residents r
            ON p.resident_id = r.resident_id
        JOIN users u
            ON r.user_id = u.user_id
        ORDER BY p.payment_month DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error(
                "Error fetching payments:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch payments"
            });
        }

        res.json(results);
    });
};


// ==========================================
// GET PAYMENTS FOR ONE RESIDENT
// ==========================================
const getResidentPayments = (req, res) => {

    const { residentId } = req.params;

    const sql = `
        SELECT
            p.payment_id,
            p.resident_id,
            u.name,
            r.flat_number,
            p.amount,
            p.payment_month,
            p.payment_status,
            p.payment_method,
            p.transaction_reference,
            p.paid_at
        FROM payments p
        JOIN residents r
            ON p.resident_id = r.resident_id
        JOIN users u
            ON r.user_id = u.user_id
        WHERE p.resident_id = ?
        ORDER BY p.payment_month DESC
    `;

    db.query(
        sql,
        [residentId],
        (err, results) => {

            if (err) {
                console.error(
                    "Error fetching resident payments:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to fetch resident payments"
                });
            }

            res.json(results);
        }
    );
};


// ==========================================
// CREATE PAYMENT
// ==========================================
const createPayment = (req, res) => {

    const {
        resident_id,
        amount,
        payment_month
    } = req.body;

    // Validate required fields
    if (
        !resident_id ||
        !amount ||
        !payment_month
    ) {
        return res.status(400).json({
            message:
                "Resident, amount and payment month are required"
        });
    }

    const sql = `
        INSERT INTO payments
        (
            resident_id,
            amount,
            payment_month,
            payment_status
        )
        VALUES (?, ?, ?, 'Pending')
    `;

    db.query(
        sql,
        [
            resident_id,
            amount,
            payment_month
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Error creating payment:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to create payment"
                });
            }

            res.status(201).json({
                message:
                    "Payment created successfully",
                payment_id:
                    result.insertId
            });
        }
    );
};


// ==========================================
// MARK PAYMENT AS PAID
// ==========================================
const markPaymentAsPaid = (req, res) => {

    const { paymentId } = req.params;

    const transactionReference =
        "DEMO-" + Date.now();

    const sql = `
        UPDATE payments
        SET
            payment_status = 'Paid',
            payment_method = 'Demo Payment',
            transaction_reference = ?,
            paid_at = NOW()
        WHERE payment_id = ?
    `;

    db.query(
        sql,
        [
            transactionReference,
            paymentId
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Error marking payment as paid:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to update payment"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        "Payment not found"
                });
            }

            res.json({
                message:
                    "Payment completed successfully",
                transaction_reference:
                    transactionReference
            });
        }
    );
};


module.exports = {
    getPayments,
    getResidentPayments,
    createPayment,
    markPaymentAsPaid
};