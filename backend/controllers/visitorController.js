const db = require("../config/db");

// ==========================================
// GET ALL VISITORS
// ==========================================
const getVisitors = (req, res) => {

    const sql = `
        SELECT
            v.visitor_id,
            v.resident_id,
            u.name AS resident_name,
            r.flat_number,
            v.visitor_name,
            v.visitor_phone,
            v.visit_date,
            v.visit_time,
            v.purpose,
            v.status,
            v.created_at
        FROM visitors v
        JOIN residents r
            ON v.resident_id = r.resident_id
        JOIN users u
            ON r.user_id = u.user_id
        ORDER BY v.visit_date DESC, v.visit_time DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Error fetching visitors:", err);

            return res.status(500).json({
                message: "Failed to fetch visitors"
            });
        }

        res.json(results);
    });
};


// ==========================================
// CREATE VISITOR
// ==========================================
const createVisitor = (req, res) => {

    const {
        resident_id,
        visitor_name,
        visitor_phone,
        visit_date,
        visit_time,
        purpose
    } = req.body;

    if (
        !resident_id ||
        !visitor_name ||
        !visit_date ||
        !visit_time
    ) {
        return res.status(400).json({
            message: "Resident, visitor name, date and time are required"
        });
    }

    const sql = `
        INSERT INTO visitors
        (
            resident_id,
            visitor_name,
            visitor_phone,
            visit_date,
            visit_time,
            purpose,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, 'Expected')
    `;

    db.query(
        sql,
        [
            resident_id,
            visitor_name,
            visitor_phone || null,
            visit_date,
            visit_time,
            purpose || null
        ],
        (err, result) => {

            if (err) {
                console.error("Error creating visitor:", err);

                return res.status(500).json({
                    message: "Failed to create visitor"
                });
            }

            res.status(201).json({
                message: "Visitor added successfully",
                visitor_id: result.insertId
            });
        }
    );
};


// ==========================================
// DELETE VISITOR
// ==========================================
const deleteVisitor = (req, res) => {

    const { id } = req.params;

    const sql = `
        DELETE FROM visitors
        WHERE visitor_id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error("Error deleting visitor:", err);

            return res.status(500).json({
                message: "Failed to delete visitor"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Visitor not found"
            });
        }

        res.json({
            message: "Visitor deleted successfully"
        });
    });
};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    getVisitors,
    createVisitor,
    deleteVisitor
};