const db = require("../config/db");

// ==========================================
// GET ALL COMPLAINTS
// ==========================================
const getComplaints = (req, res) => {

    const sql = `
        SELECT
            c.complaint_id,
            c.resident_id,
            u.name AS resident_name,
            r.flat_number,
            c.title,
            c.description,
            c.status,
            c.created_at,
            c.resolved_at
        FROM complaints c
        JOIN residents r
            ON c.resident_id = r.resident_id
        JOIN users u
            ON r.user_id = u.user_id
        ORDER BY c.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Error fetching complaints:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch complaints"
            });
        }

        res.json(results);

    });
};


// ==========================================
// CREATE COMPLAINT
// ==========================================
const createComplaint = (req, res) => {

    const {
        resident_id,
        title,
        description
    } = req.body;


    if (
        !resident_id ||
        !title ||
        !description
    ) {

        return res.status(400).json({
            message:
                "Resident, title and description are required"
        });

    }


    const sql = `
        INSERT INTO complaints
        (
            resident_id,
            title,
            description,
            status
        )
        VALUES (?, ?, ?, 'Open')
    `;


    db.query(
        sql,
        [
            resident_id,
            title,
            description
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Error creating complaint:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to create complaint"
                });

            }


            res.status(201).json({
                message:
                    "Complaint submitted successfully",
                complaint_id:
                    result.insertId
            });

        }
    );

};


// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================
const updateComplaintStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "Open",
        "In Progress",
        "Resolved"
    ];

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            message: "Invalid complaint status"
        });

    }


    let sql;
    let values;


    if (status === "Resolved") {

        sql = `
            UPDATE complaints
            SET
                status = ?,
                resolved_at = CURRENT_TIMESTAMP
            WHERE complaint_id = ?
        `;

        values = [
            status,
            id
        ];

    } else {

        sql = `
            UPDATE complaints
            SET
                status = ?,
                resolved_at = NULL
            WHERE complaint_id = ?
        `;

        values = [
            status,
            id
        ];

    }


    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.error(
                    "Error updating complaint:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to update complaint status"
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Complaint not found"
                });

            }


            res.json({
                message:
                    "Complaint status updated successfully"
            });

        }
    );

};


// ==========================================
// DELETE COMPLAINT
// ==========================================
const deleteComplaint = (req, res) => {

    const { id } = req.params;


    const sql = `
        DELETE FROM complaints
        WHERE complaint_id = ?
    `;


    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {

                console.error(
                    "Error deleting complaint:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to delete complaint"
                });

            }


            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message:
                        "Complaint not found"
                });

            }


            res.json({
                message:
                    "Complaint deleted successfully"
            });

        }
    );

};


// ==========================================
// EXPORT
// ==========================================
module.exports = {
    getComplaints,
    createComplaint,
    updateComplaintStatus,
    deleteComplaint
};