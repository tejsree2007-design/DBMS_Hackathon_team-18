const db = require("../config/db");

// ==========================================
// GET ALL AVAILABLE AMENITIES
// ==========================================
const getAmenities = (req, res) => {
    const sql = `
        SELECT
            amenity_id,
            name,
            description,
            capacity,
            booking_fee,
            status
        FROM amenities
        WHERE LOWER(status) = 'available'
        ORDER BY name ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching amenities:", err);

            return res.status(500).json({
                message: "Failed to fetch amenities"
            });
        }

        return res.json(results);
    });
};

// ==========================================
// CREATE AMENITY
// ==========================================
const createAmenity = (req, res) => {
    const {
        name,
        description,
        capacity,
        booking_fee
    } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            message: "Amenity name is required"
        });
    }

    const sql = `
        INSERT INTO amenities (
            name,
            description,
            capacity,
            booking_fee,
            status
        )
        VALUES (?, ?, ?, ?, 'Available')
    `;

    const values = [
        name.trim(),
        description || null,
        capacity || null,
        booking_fee || 0
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error creating amenity:", err);

            return res.status(500).json({
                message: "Failed to create amenity"
            });
        }

        return res.status(201).json({
            message: "Amenity created successfully",
            amenity_id: result.insertId
        });
    });
};

// ==========================================
// GET ALL AMENITY BOOKINGS
// ==========================================
const getAmenityBookings = (req, res) => {
    const sql = `
        SELECT
            ab.booking_id,
            ab.amenity_id,
            ab.resident_id,
            a.name AS amenity_name,
            u.name AS resident_name,
            r.flat_number,
            ab.booking_date,
            ab.start_time,
            ab.end_time,
            ab.status,
            ab.created_at
        FROM amenity_bookings ab
        JOIN amenities a
            ON ab.amenity_id = a.amenity_id
        JOIN residents r
            ON ab.resident_id = r.resident_id
        JOIN users u
            ON r.user_id = u.user_id
        ORDER BY
            ab.booking_date DESC,
            ab.start_time DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching amenity bookings:", err);

            return res.status(500).json({
                message: "Failed to fetch amenity bookings"
            });
        }

        return res.json(results);
    });
};

// ==========================================
// CREATE AMENITY BOOKING
// ==========================================
const createAmenityBooking = (req, res) => {
    const {
        amenity_id,
        resident_id,
        booking_date,
        start_time,
        end_time
    } = req.body;

    if (
        !amenity_id ||
        !resident_id ||
        !booking_date ||
        !start_time ||
        !end_time
    ) {
        return res.status(400).json({
            message:
                "Amenity, resident, date, start time and end time are required"
        });
    }

    if (start_time >= end_time) {
        return res.status(400).json({
            message: "End time must be later than start time"
        });
    }

    // Check that the amenity exists and is available.
    const checkAmenitySql = `
        SELECT amenity_id
        FROM amenities
        WHERE amenity_id = ?
          AND LOWER(status) = 'available'
    `;

    db.query(
        checkAmenitySql,
        [amenity_id],
        (err, amenityResults) => {
            if (err) {
                console.error("Error checking amenity:", err);

                return res.status(500).json({
                    message: "Failed to check amenity"
                });
            }

            if (amenityResults.length === 0) {
                return res.status(404).json({
                    message:
                        "Amenity not found or is currently unavailable"
                });
            }

            // Check for overlapping active bookings.
            const conflictSql = `
                SELECT booking_id
                FROM amenity_bookings
                WHERE amenity_id = ?
                  AND booking_date = ?
                  AND status = 'Booked'
                  AND start_time < ?
                  AND end_time > ?
            `;

            db.query(
                conflictSql,
                [
                    amenity_id,
                    booking_date,
                    end_time,
                    start_time
                ],
                (err, conflicts) => {
                    if (err) {
                        console.error(
                            "Error checking booking conflict:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to check booking availability"
                        });
                    }

                    if (conflicts.length > 0) {
                        return res.status(409).json({
                            message:
                                "This amenity is already booked for the selected time"
                        });
                    }

                    // Create the booking.
                    const insertSql = `
                        INSERT INTO amenity_bookings (
                            amenity_id,
                            resident_id,
                            booking_date,
                            start_time,
                            end_time,
                            status
                        )
                        VALUES (?, ?, ?, ?, ?, 'Booked')
                    `;

                    db.query(
                        insertSql,
                        [
                            amenity_id,
                            resident_id,
                            booking_date,
                            start_time,
                            end_time
                        ],
                        (err, result) => {
                            if (err) {
                                console.error(
                                    "Error creating amenity booking:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Failed to create amenity booking"
                                });
                            }

                            return res.status(201).json({
                                message: "Amenity booked successfully",
                                booking_id: result.insertId
                            });
                        }
                    );
                }
            );
        }
    );
};

// ==========================================
// CANCEL AMENITY BOOKING
// ==========================================
const deleteAmenityBooking = (req, res) => {
    const { id } = req.params;

    const sql = `
        UPDATE amenity_bookings
        SET status = 'Cancelled'
        WHERE booking_id = ?
          AND status = 'Booked'
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error cancelling booking:", err);

            return res.status(500).json({
                message: "Failed to cancel booking"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message:
                    "Active booking not found or booking is already cancelled"
            });
        }

        return res.json({
            message: "Booking cancelled successfully"
        });
    });
};

// ==========================================
// DELETE AMENITY (SOFT DELETE)
// ==========================================
const deleteAmenity = (req, res) => {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        return res.status(400).json({
            message: "A valid amenity ID is required"
        });
    }

    const sql = `
        UPDATE amenities
        SET status = 'Unavailable'
        WHERE amenity_id = ?
          AND LOWER(status) = 'available'
    `;

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error disabling amenity:", err);

            return res.status(500).json({
                message: "Failed to disable amenity"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message:
                    "Amenity not found or is already unavailable"
            });
        }

        return res.json({
            message: "Amenity marked as unavailable successfully"
        });
    });
};

// ==========================================
// EXPORT
// ==========================================
module.exports = {
    getAmenities,
    createAmenity,
    getAmenityBookings,
    createAmenityBooking,
    deleteAmenityBooking,
    deleteAmenity
};