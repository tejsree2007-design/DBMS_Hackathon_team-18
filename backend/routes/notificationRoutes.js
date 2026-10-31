const express = require("express");

const router = express.Router();

const {
    getNotifications,
    createNotification,
    markNotificationAsRead
} = require("../controllers/notificationController");


// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

router.get(
    "/",
    getNotifications
);


// ==========================================
// CREATE NOTIFICATION
// ==========================================

router.post(
    "/",
    createNotification
);


// ==========================================
// MARK NOTIFICATION AS READ
// ==========================================

router.put(
    "/:notification_id/read",
    markNotificationAsRead
);


module.exports = router;