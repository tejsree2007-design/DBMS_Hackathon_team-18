const db = require("../config/db");


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

const getNotifications = (req, res) => {

    const sql = `
        SELECT
            n.notification_id,
            n.user_id,
            n.title,
            n.message,
            n.is_read,
            n.created_at,
            u.name,
            u.email
        FROM notifications n
        JOIN users u
            ON n.user_id = u.user_id
        ORDER BY n.created_at DESC
    `;


    db.query(sql, (err, results) => {

        if (err) {

            console.error(
                "Error fetching notifications:",
                err
            );

            return res.status(500).json({
                message: "Failed to fetch notifications"
            });

        }


        res.json(results);

    });

};


// ==========================================
// CREATE NOTIFICATION
// ==========================================

const createNotification = (req, res) => {

    const {
        user_id,
        title,
        message
    } = req.body;


    if (
        !user_id ||
        !title ||
        !message
    ) {

        return res.status(400).json({
            message:
                "user_id, title and message are required"
        });

    }


    const sql = `
        INSERT INTO notifications
        (
            user_id,
            title,
            message
        )
        VALUES (?, ?, ?)
    `;


    db.query(
        sql,
        [
            user_id,
            title,
            message
        ],
        (err, result) => {

            if (err) {

                console.error(
                    "Error creating notification:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to create notification"
                });

            }


            res.status(201).json({

                message:
                    "Notification created successfully",

                notification_id:
                    result.insertId

            });

        }
    );

};


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

const markNotificationAsRead = (req, res) => {

    const {
        notification_id
    } = req.params;


    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE notification_id = ?
    `;


    db.query(
        sql,
        [notification_id],
        (err, result) => {

            if (err) {

                console.error(
                    "Error updating notification:",
                    err
                );

                return res.status(500).json({
                    message:
                        "Failed to update notification"
                });

            }


            res.json({

                message:
                    "Notification marked as read"

            });

        }
    );

};


module.exports = {

    getNotifications,

    createNotification,

    markNotificationAsRead

};