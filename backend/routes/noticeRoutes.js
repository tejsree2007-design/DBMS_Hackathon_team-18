const express = require("express");

const router = express.Router();

const {
    getNotices,
    createNotice
} = require("../controllers/noticeController");


// GET ALL NOTICES
router.get(
    "/",
    getNotices
);


// CREATE NOTICE
router.post(
    "/",
    createNotice
);


module.exports = router;