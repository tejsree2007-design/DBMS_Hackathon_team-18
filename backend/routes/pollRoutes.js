const express = require("express");

const router = express.Router();

const {
    getPolls,
    createPoll,
    votePoll,
    checkResidentVote,
    updatePollStatus
} = require("../controllers/pollController");


// ==========================================
// GET ALL POLLS
// ==========================================

router.get(
    "/",
    getPolls
);


// ==========================================
// CREATE POLL
// ==========================================

router.post(
    "/",
    createPoll
);


// ==========================================
// VOTE IN POLL
// ==========================================

router.post(
    "/:pollId/vote",
    votePoll
);


// ==========================================
// CHECK RESIDENT VOTE
// ==========================================

router.get(
    "/:pollId/vote/:residentId",
    checkResidentVote
);


// ==========================================
// UPDATE POLL STATUS
// ==========================================

router.put(
    "/:id/status",
    updatePollStatus
);


module.exports = router;