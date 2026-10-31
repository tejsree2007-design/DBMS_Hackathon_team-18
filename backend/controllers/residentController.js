const db = require("../config/db");

const getResidents = (req, res) => {
    const sql = `
        SELECT 
            r.resident_id,
            r.user_id,
            u.name,
            u.email,
            r.flat_number,
            r.phone
        FROM residents r
        JOIN users u 
            ON r.user_id = u.user_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching residents:", err);

            return res.status(500).json({
                message: "Failed to fetch residents"
            });
        }

        res.json(results);
    });
};


// ==========================================
// DELETE RESIDENT
// ==========================================
const deleteResident = (req, res) => {

    const residentId = req.params.id;

    if (!residentId) {
        return res.status(400).json({
            message: "Resident ID is required"
        });
    }

    // First get the user_id belonging to this resident
    const getResidentSql = `
        SELECT user_id
        FROM residents
        WHERE resident_id = ?
    `;

    db.query(
        getResidentSql,
        [residentId],
        (err, results) => {

            if (err) {
                console.error(
                    "Error finding resident:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to find resident"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Resident not found"
                });
            }

            const userId = results[0].user_id;

            // Start transaction
            db.beginTransaction((err) => {

                if (err) {
                    console.error(
                        "Transaction error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to start deletion"
                    });
                }


                // ==========================================
                // 1. DELETE PAYMENTS
                // ==========================================
                const deletePaymentsSql = `
                    DELETE FROM payments
                    WHERE resident_id = ?
                `;

                db.query(
                    deletePaymentsSql,
                    [residentId],
                    (err) => {

                        if (err) {
                            return rollback(
                                db,
                                res,
                                err
                            );
                        }


                        // ==========================================
                        // 2. DELETE VISITORS
                        // ==========================================
                        const deleteVisitorsSql = `
                            DELETE FROM visitors
                            WHERE resident_id = ?
                        `;

                        db.query(
                            deleteVisitorsSql,
                            [residentId],
                            (err) => {

                                if (err) {
                                    return rollback(
                                        db,
                                        res,
                                        err
                                    );
                                }


                                // ==========================================
                                // 3. DELETE COMPLAINTS
                                // ==========================================
                                const deleteComplaintsSql = `
                                    DELETE FROM complaints
                                    WHERE resident_id = ?
                                `;

                                db.query(
                                    deleteComplaintsSql,
                                    [residentId],
                                    (err) => {

                                        if (err) {
                                            return rollback(
                                                db,
                                                res,
                                                err
                                            );
                                        }


                                        // ==========================================
                                        // 4. DELETE POLL VOTES
                                        // ==========================================
                                        const deleteVotesSql = `
                                            DELETE FROM poll_votes
                                            WHERE resident_id = ?
                                        `;

                                        db.query(
                                            deleteVotesSql,
                                            [residentId],
                                            (err) => {

                                                if (err) {
                                                    return rollback(
                                                        db,
                                                        res,
                                                        err
                                                    );
                                                }


                                                // ==========================================
                                                // 5. DELETE AMENITY BOOKINGS
                                                // ==========================================
                                                const deleteBookingsSql = `
                                                    DELETE FROM amenity_bookings
                                                    WHERE resident_id = ?
                                                `;

                                                db.query(
                                                    deleteBookingsSql,
                                                    [residentId],
                                                    (err) => {

                                                        if (err) {
                                                            return rollback(
                                                                db,
                                                                res,
                                                                err
                                                            );
                                                        }


                                                        // ==========================================
                                                        // 6. DELETE NOTIFICATIONS
                                                        // ==========================================
                                                        const deleteNotificationsSql = `
                                                            DELETE FROM notifications
                                                            WHERE user_id = ?
                                                        `;

                                                        db.query(
                                                            deleteNotificationsSql,
                                                            [userId],
                                                            (err) => {

                                                                if (err) {
                                                                    return rollback(
                                                                        db,
                                                                        res,
                                                                        err
                                                                    );
                                                                }


                                                                // ==========================================
                                                                // 7. DELETE RESIDENT
                                                                // ==========================================
                                                                const deleteResidentSql = `
                                                                    DELETE FROM residents
                                                                    WHERE resident_id = ?
                                                                `;

                                                                db.query(
                                                                    deleteResidentSql,
                                                                    [residentId],
                                                                    (err) => {

                                                                        if (err) {
                                                                            return rollback(
                                                                                db,
                                                                                res,
                                                                                err
                                                                            );
                                                                        }


                                                                        // ==========================================
                                                                        // 8. DELETE USER LOGIN
                                                                        // ==========================================
                                                                        const deleteUserSql = `
                                                                            DELETE FROM users
                                                                            WHERE user_id = ?
                                                                        `;

                                                                        db.query(
                                                                            deleteUserSql,
                                                                            [userId],
                                                                            (err) => {

                                                                                if (err) {
                                                                                    return rollback(
                                                                                        db,
                                                                                        res,
                                                                                        err
                                                                                    );
                                                                                }


                                                                                // Everything successful
                                                                                db.commit(
                                                                                    (err) => {

                                                                                        if (err) {
                                                                                            return rollback(
                                                                                                db,
                                                                                                res,
                                                                                                err
                                                                                            );
                                                                                        }

                                                                                        res.json({
                                                                                            message:
                                                                                                "Resident deleted successfully"
                                                                                        });

                                                                                    }
                                                                                );

                                                                            }
                                                                        );

                                                                    }
                                                                );

                                                            }
                                                        );

                                                    }
                                                );

                                            }
                                        );

                                    }
                                );

                            }
                        );

                    }
                );

            });

        }
    );
};


// ==========================================
// ROLLBACK HELPER
// ==========================================
const rollback = (db, res, err) => {

    console.error(
        "Error deleting resident:",
        err
    );

    db.rollback(() => {

        res.status(500).json({
            message:
                "Failed to delete resident"
        });

    });
};


module.exports = {
    getResidents,
    deleteResident
};