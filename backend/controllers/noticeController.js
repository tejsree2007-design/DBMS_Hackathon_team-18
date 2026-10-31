const db = require("../config/db");

// ==========================================
// GET ALL NOTICES
// ==========================================
const getNotices = (req, res) => {

    const sql = `
        SELECT
            notice_id,
            title,
            description,
            created_by,
            created_at
        FROM notices
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Error fetching notices:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch notices"
            });
        }

        res.json(results);

    });
};


// ==========================================
// CREATE NOTICE
// ==========================================
const createNotice = (req, res) => {

    const {
        title,
        description
    } = req.body;


    if (!title || !description) {

        return res.status(400).json({
            message: "Title and description are required"
        });

    }


    // Find an Admin user automatically
    const adminSql = `
        SELECT u.user_id
        FROM users u
        JOIN roles r
            ON u.role_id = r.role_id
        WHERE r.role_name = 'Admin'
        LIMIT 1
    `;


    db.query(adminSql, (adminErr, adminResults) => {

        if (adminErr) {

            console.error(
                "Error finding admin user:",
                adminErr
            );

            return res.status(500).json({
                message: "Failed to find admin user"
            });

        }


        if (adminResults.length === 0) {

            return res.status(400).json({
                message: "No admin user found"
            });

        }


        const adminUserId =
            adminResults[0].user_id;


        // Insert notice
        const sql = `
            INSERT INTO notices
            (
                title,
                description,
                created_by
            )
            VALUES (?, ?, ?)
        `;


        const values = [
            title,
            description,
            adminUserId
        ];


        db.query(
            sql,
            values,
            (err, result) => {

                if (err) {

                    console.error(
                        "Error creating notice:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to create notice"
                    });

                }


                res.status(201).json({

                    message:
                        "Notice created successfully",

                    notice_id:
                        result.insertId

                });

            }
        );

    });

};


module.exports = {
    getNotices,
    createNotice
};